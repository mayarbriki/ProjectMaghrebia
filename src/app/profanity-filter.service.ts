import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfanityFilterService {
  private badWords: Set<string> = new Set();

  constructor(private http: HttpClient) {
    this.loadBadWords().subscribe();
  }

  private loadBadWords(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:6061/api/blogs/bad-words').pipe(
      tap(badWords => {
        this.badWords = new Set(badWords.map(word => word.toLowerCase()));
        console.log('Loaded bad words:', this.badWords);
      })
    );
  }

  containsBadWords(text: string): boolean {
    if (!text || text.trim() === '') {
      return false;
    }

    const textLowerCase = text.toLowerCase();
    const words = textLowerCase.split(/\b/);

    return words.some(word => this.badWords.has(word.trim()));
  }

  censorBadWords(text: string): string {
    if (!text || text.trim() === '') {
      return text;
    }

    let result = text;
    this.badWords.forEach(badWord => {
      const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
      const replacement = badWord.charAt(0) + '*'.repeat(badWord.length - 2) + badWord.charAt(badWord.length - 1);
      result = result.replace(regex, replacement);
    });

    return result;
  }
}