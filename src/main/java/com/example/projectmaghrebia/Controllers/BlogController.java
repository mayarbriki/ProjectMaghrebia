package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Blog;
import com.example.projectmaghrebia.Entities.BlogType;
import com.example.projectmaghrebia.Entities.Comment;
import com.example.projectmaghrebia.Services.FileStorageService;
import com.example.projectmaghrebia.Services.IBlogService;
import com.itextpdf.text.Document;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Added to inject file.upload-dir
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.logging.Logger; // Added for logging

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private static final Logger LOGGER = Logger.getLogger(BlogController.class.getName());

    @Autowired
    private IBlogService blogService;

    @Autowired
    private FileStorageService fileStorageService;

    // Inject the upload directory from application.properties
    @Value("${file.upload-dir}")
    private String UPLOAD_DIR; // Will be set to "upload-dir" based on application.properties
    @Value("${translator.api-key}")
    private String translatorApiKey;

    @Value("${translator.endpoint}")
    private String translatorEndpoint;

    @Value("${translator.region}")
    private String translatorRegion;

    private final RestTemplate restTemplate = new RestTemplate();

    // Existing methods remain unchanged...

    // New translation endpoint
    @PostMapping("/{id}/translate")
    public ResponseEntity<?> translateBlog(
            @PathVariable int id,
            @RequestParam("targetLanguage") String targetLanguage) {
        try {
            // Fetch the blog by ID
            Optional<Blog> blogOpt = blogService.getBlogById(id);
            if (blogOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Blog not found");
            }

            Blog blog = blogOpt.get();

            // Prepare the text to translate (title and content)
            String[] textsToTranslate = new String[]{blog.getTitle(), blog.getContent()};
            String[] translatedTexts = translateText(textsToTranslate, targetLanguage);

            if (translatedTexts == null) {
                return ResponseEntity.status(500).body("Error translating blog content");
            }

            // Create a response object with translated content
            Blog translatedBlog = new Blog();
            translatedBlog.setId(blog.getId());
            translatedBlog.setTitle(translatedTexts[0]); // Translated title
            translatedBlog.setContent(translatedTexts[1]); // Translated content
            translatedBlog.setAuthor(blog.getAuthor());
            translatedBlog.setType(blog.getType());
            translatedBlog.setImage(blog.getImage());
            translatedBlog.setCreatedAt(blog.getCreatedAt());
            translatedBlog.setScheduledPublicationDate(blog.getScheduledPublicationDate());
            translatedBlog.setPublished(blog.isPublished());
            translatedBlog.setLikes(blog.getLikes());

            return ResponseEntity.ok(translatedBlog);
        } catch (Exception e) {
            LOGGER.severe("Error translating blog: " + e.getMessage());
            return ResponseEntity.status(500).body("Error translating blog: " + e.getMessage());
        }
    }

    // Helper method to call Microsoft Translator API
    private String[] translateText(String[] texts, String targetLanguage) {
        try {
            String path = "/translate?api-version=3.0&to=" + targetLanguage;
            String url = translatorEndpoint + path;

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("Ocp-Apim-Subscription-Key", translatorApiKey);
            headers.set("Ocp-Apim-Subscription-Region", translatorRegion);
            headers.set("Content-Type", "application/json");
            headers.set("X-ClientTraceId", UUID.randomUUID().toString());

            // Prepare the request body
            List<Map<String, String>> body = new java.util.ArrayList<>();
            for (String text : texts) {
                body.add(Map.of("Text", text));
            }

            // Create the HTTP entity
            org.springframework.http.HttpEntity<List<Map<String, String>>> requestEntity =
                    new org.springframework.http.HttpEntity<>(body, headers);

            // Make the API call
            ResponseEntity<List> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.POST,
                    requestEntity,
                    List.class
            );

            // Parse the response
            List<Map<String, List<Map<String, String>>>> translations = response.getBody();
            if (translations == null || translations.size() != texts.length) {
                return null;
            }

            // Extract translated texts
            String[] translatedTexts = new String[texts.length];
            for (int i = 0; i < translations.size(); i++) {
                List<Map<String, String>> translationList = translations.get(i).get("translations");
                if (translationList != null && !translationList.isEmpty()) {
                    translatedTexts[i] = translationList.get(0).get("text");
                } else {
                    return null;
                }
            }

            return translatedTexts;
        } catch (Exception e) {
            LOGGER.severe("Error calling Translator API: " + e.getMessage());
            return null;
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBlog(
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("content") String content,
            @RequestParam("type") BlogType type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "scheduledPublicationDate", required = false)
            @Parameter(description = "Scheduled publication date in ISO-8601 format (e.g., 2025-04-08T10:00:00)", example = "2025-04-08T10:00:00")
            String scheduledDate) {
        try {
            Blog blog = new Blog();
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setContent(content);
            blog.setType(type);
            blog.setCreatedAt(LocalDateTime.now());

            if (scheduledDate != null && !scheduledDate.isEmpty()) {
                blog.setScheduledPublicationDate(LocalDateTime.parse(scheduledDate));
                blog.setPublished(false);
            } else {
                blog.setPublished(true);
            }

            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.store(file);
                blog.setImage(fileName);
            }

            return ResponseEntity.ok(blogService.createBlog(blog));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating blog: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBlog(
            @PathVariable int id,
            @RequestParam("title") String title,
            @RequestParam("author") String author,
            @RequestParam("content") String content,
            @RequestParam("type") BlogType type,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "scheduledPublicationDate", required = false)
            @Parameter(description = "Scheduled publication date in ISO-8601 format (e.g., 2025-04-08T10:00:00)", example = "2025-04-08T10:00:00")
            String scheduledDate) {
        try {
            Optional<Blog> existingBlog = blogService.getBlogById(id);
            if (existingBlog.isEmpty()) {
                return ResponseEntity.status(404).body("Blog not found");
            }

            Blog blog = existingBlog.get();
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setContent(content);
            blog.setType(type);

            if (scheduledDate != null && !scheduledDate.isEmpty()) {
                blog.setScheduledPublicationDate(LocalDateTime.parse(scheduledDate));
                blog.setPublished(false);
            }

            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.store(file);
                blog.setImage(fileName);
            }

            return ResponseEntity.ok(blogService.updateBlog(id, blog));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating blog: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Blog>> getAllBlogs(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        List<Blog> blogs = blogService.getAllBlogsSorted(sortBy, direction);
        blogs.forEach(System.out::println);
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable int id) {
        Optional<Blog> blog = blogService.getBlogById(id);
        return blog.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable int id) {
        Optional<Blog> existingBlog = blogService.getBlogById(id);
        if (existingBlog.isEmpty()) {
            return ResponseEntity.status(404).body("Blog not found");
        }
        blogService.deleteBlog(id);
        return ResponseEntity.ok("Blog deleted successfully");
    }

    @GetMapping("/scheduled")
    public ResponseEntity<List<Blog>> getScheduledBlogs() {
        return ResponseEntity.ok(blogService.getScheduledBlogs());
    }

    @GetMapping("/published")
    public ResponseEntity<List<Blog>> getPublishedBlogs() {
        return ResponseEntity.ok(blogService.getPublishedBlogs());
    }

    @PostMapping("/{id}/like")
    public Blog likeBlog(@PathVariable int id) {
        return blogService.likeBlog(id);
    }

    @PostMapping("/{id}/unlike")
    public Blog unlikeBlog(@PathVariable int id) {
        return blogService.unlikeBlog(id);
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getBlogStatistics() {
        return ResponseEntity.ok(blogService.getBlogStatistics());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Blog>> searchBlogs(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        List<Blog> blogs = blogService.searchBlogs(query, sortBy, direction);
        return ResponseEntity.ok(blogs);
    }

    @GetMapping(value = "/export")
    public ResponseEntity<byte[]> exportBlogs(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "csv") String format) {
        try {
            List<Blog> blogs;
            if (query != null && !query.trim().isEmpty()) {
                blogs = blogService.searchBlogs(query, sortBy, direction);
            } else {
                blogs = blogService.getAllBlogsSorted(sortBy, direction);
            }

            blogs = blogs.stream().filter(Blog::isPublished).collect(Collectors.toList());

            byte[] fileBytes;
            String fileName;
            MediaType mediaType;

            if ("pdf".equalsIgnoreCase(format)) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                Document document = new Document();
                PdfWriter.getInstance(document, baos);
                document.open();
                document.add(new Paragraph("Exported Blogs"));
                document.add(new Paragraph(" "));

                for (Blog blog : blogs) {
                    document.add(new Paragraph("ID: " + blog.getId()));
                    document.add(new Paragraph("Title: " + blog.getTitle()));
                    document.add(new Paragraph("Author: " + blog.getAuthor()));
                    document.add(new Paragraph("Content: " + blog.getContent()));
                    document.add(new Paragraph("Type: " + blog.getType()));
                    if (blog.getImage() != null) {
                        try {
                            // Replace spaces in filename to avoid path issues
                            String imageFileName = blog.getImage().replace(" ", "_");
                            Path imagePath = Paths.get(UPLOAD_DIR, imageFileName);
                            LOGGER.info("Looking for image at: " + imagePath.toAbsolutePath());
                            if (Files.exists(imagePath)) {
                                Image img = Image.getInstance(imagePath.toAbsolutePath().toString());
                                img.scaleToFit(100, 100);
                                document.add(img);
                            } else {
                                LOGGER.warning("Image not found at: " + imagePath.toAbsolutePath());
                                document.add(new Paragraph("Image: " + blog.getImage() + " (Not Found)"));
                            }
                        } catch (Exception e) {
                            LOGGER.severe("Error loading image: " + blog.getImage() + " - " + e.getMessage());
                            document.add(new Paragraph("Image: " + blog.getImage() + " (Error Loading)"));
                        }
                    } else {
                        document.add(new Paragraph("Image: N/A"));
                    }
                    document.add(new Paragraph("Created At: " + (blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : "N/A")));
                    document.add(new Paragraph("Scheduled Publication Date: " + (blog.getScheduledPublicationDate() != null ? blog.getScheduledPublicationDate().toString() : "N/A")));
                    document.add(new Paragraph("Published: " + blog.isPublished()));
                    document.add(new Paragraph("Likes: " + blog.getLikes()));
                    document.add(new Paragraph("-------------------"));
                }
                document.close();
                fileBytes = baos.toByteArray();
                fileName = "blogs_export.pdf";
                mediaType = MediaType.APPLICATION_PDF;
            } else {
                StringBuilder csvContent = new StringBuilder();
                csvContent.append("ID,Title,Author,Content,Type,Image,Created At,Scheduled Publication Date,Published,Likes\n");
                for (Blog blog : blogs) {
                    csvContent.append(String.format(
                            "%d,\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%s,%d\n",
                            blog.getId(),
                            escapeCsv(blog.getTitle()),
                            escapeCsv(blog.getAuthor()),
                            escapeCsv(blog.getContent()),
                            blog.getType(),
                            blog.getImage() != null ? escapeCsv(blog.getImage()) : "",
                            blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : "",
                            blog.getScheduledPublicationDate() != null ? blog.getScheduledPublicationDate().toString() : "",
                            blog.isPublished(),
                            blog.getLikes()
                    ));
                }
                fileBytes = csvContent.toString().getBytes(StandardCharsets.UTF_8);
                fileName = "blogs_export.csv";
                mediaType = MediaType.parseMediaType("text/csv");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", fileName);

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.severe("Error exporting blogs: " + e.getMessage());
            return new ResponseEntity<>("Error exporting blogs: ".getBytes(StandardCharsets.UTF_8), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/{id}/export")
    public ResponseEntity<byte[]> exportBlogById(
            @PathVariable int id,
            @RequestParam(defaultValue = "csv") String format) {
        try {
            Optional<Blog> blogOpt = blogService.getBlogById(id);
            if (blogOpt.isEmpty()) {
                return new ResponseEntity<>("Blog not found".getBytes(StandardCharsets.UTF_8), HttpStatus.NOT_FOUND);
            }

            Blog blog = blogOpt.get();
            byte[] fileBytes;
            String fileName;
            MediaType mediaType;

            if ("pdf".equalsIgnoreCase(format)) {
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                Document document = new Document();
                PdfWriter.getInstance(document, baos);
                document.open();
                document.add(new Paragraph("Exported Blog"));
                document.add(new Paragraph(" "));
                document.add(new Paragraph("ID: " + blog.getId()));
                document.add(new Paragraph("Title: " + blog.getTitle()));
                document.add(new Paragraph("Author: " + blog.getAuthor()));
                document.add(new Paragraph("Content: " + blog.getContent()));
                document.add(new Paragraph("Type: " + blog.getType()));
                if (blog.getImage() != null) {
                    try {
                        // Replace spaces in filename to avoid path issues
                        String imageFileName = blog.getImage().replace(" ", "_");
                        Path imagePath = Paths.get(UPLOAD_DIR, imageFileName);
                        LOGGER.info("Looking for image at: " + imagePath.toAbsolutePath());
                        if (Files.exists(imagePath)) {
                            Image img = Image.getInstance(imagePath.toAbsolutePath().toString());
                            img.scaleToFit(100, 100);
                            document.add(img);
                        } else {
                            LOGGER.warning("Image not found at: " + imagePath.toAbsolutePath());
                            document.add(new Paragraph("Image: " + blog.getImage() + " (Not Found)"));
                        }
                    } catch (Exception e) {
                        LOGGER.severe("Error loading image: " + blog.getImage() + " - " + e.getMessage());
                        document.add(new Paragraph("Image: " + blog.getImage() + " (Error Loading)"));
                    }
                } else {
                    document.add(new Paragraph("Image: N/A"));
                }
                document.add(new Paragraph("Created At: " + (blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : "N/A")));
                document.add(new Paragraph("Scheduled Publication Date: " + (blog.getScheduledPublicationDate() != null ? blog.getScheduledPublicationDate().toString() : "N/A")));
                document.add(new Paragraph("Published: " + blog.isPublished()));
                document.add(new Paragraph("Likes: " + blog.getLikes()));
                document.close();
                fileBytes = baos.toByteArray();
                fileName = "blog_" + id + "_export.pdf";
                mediaType = MediaType.APPLICATION_PDF;
            } else {
                StringBuilder csvContent = new StringBuilder();
                csvContent.append("ID,Title,Author,Content,Type,Image,Created At,Scheduled Publication Date,Published,Likes\n");
                csvContent.append(String.format(
                        "%d,\"%s\",\"%s\",\"%s\",%s,%s,%s,%s,%s,%d\n",
                        blog.getId(),
                        escapeCsv(blog.getTitle()),
                        escapeCsv(blog.getAuthor()),
                        escapeCsv(blog.getContent()),
                        blog.getType(),
                        blog.getImage() != null ? escapeCsv(blog.getImage()) : "",
                        blog.getCreatedAt() != null ? blog.getCreatedAt().toString() : "",
                        blog.getScheduledPublicationDate() != null ? blog.getScheduledPublicationDate().toString() : "",
                        blog.isPublished(),
                        blog.getLikes()
                ));
                fileBytes = csvContent.toString().getBytes(StandardCharsets.UTF_8);
                fileName = "blog_" + id + "_export.csv";
                mediaType = MediaType.parseMediaType("text/csv");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(mediaType);
            headers.setContentDispositionFormData("attachment", fileName);

            return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.severe("Error exporting blog: " + e.getMessage());
            return new ResponseEntity<>("Error exporting blog: ".getBytes(StandardCharsets.UTF_8), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        return value.replace("\"", "\"\"");
    }
    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable int id,
            @RequestBody Comment comment,
            @RequestHeader(value = "X-User", required = false) String user) {
        try {
            if (user == null || user.isEmpty()) {
                return ResponseEntity.status(400).body("User must be provided in the X-User header");
            }
            comment.setUser(user);
            Comment savedComment = blogService.addComment(id, comment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding comment: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable int id,
            @RequestParam(defaultValue = "true") boolean approved) {
        List<Comment> comments = blogService.getCommentsByBlogId(id, approved);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/comments/{commentId}/approve")
    public ResponseEntity<?> approveComment(
            @PathVariable int commentId,
            @RequestHeader(value = "X-Role", required = false) String role) {
        try {
            if (!"ADMIN".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body("Only admins can approve comments");
            }
            Comment approvedComment = blogService.approveComment(commentId);
            return ResponseEntity.ok(approvedComment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving comment: " + e.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/decline")
    public ResponseEntity<?> declineComment(
            @PathVariable int commentId,
            @RequestHeader(value = "X-Role", required = false) String role) {
        try {
            if (!"ADMIN".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body("Only admins can decline comments");
            }
            Comment declinedComment = blogService.declineComment(commentId);
            return ResponseEntity.ok(declinedComment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error declining comment: " + e.getMessage());
        }
    }
}