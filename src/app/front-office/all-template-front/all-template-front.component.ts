import { Component } from '@angular/core';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { RouterModule } from '@angular/router';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { SpeakersComponent } from '../speakers/speakers.component';
import { SponsorsComponent } from '../sponsors/sponsors.component';
import { ByTicketsComponent } from '../by-tickets/by-tickets.component';
import { ConferenceComponent } from '../conference/conference.component';
import { HomeFrontComponent } from '../home-front/home-front.component';
import { ListClaimComponentFront } from '../claims/list-claim-front/list-claim-front.component';
import { AddClaimComponentFront } from '../claims/add-claim-front/add-claim-front.component';
import { ModifyClaimComponentFront } from '../claims/modify-claim-front/modify-claim-front.component';
import { ViewClaimComponentFront } from '../claims/view-claim-front/view-claim-front.component';
import { ListAssessmentComponentFront } from '../assessments/list-assessment-front/list-assessment-front.component';
import { ViewAssessmentComponentFront } from '../assessments/view-assessment-front/view-assessment-front.component';
import { ContractsComponent } from "../contracts/contracts.component";
import { PropertiesComponent } from '../properties/properties.component';
import { IncidentsComponent } from "../incidents/incidents.component";
import { BlogsComponent } from '../blogs/blogs.component';
import { ProductDisplayComponent } from 'src/app/product-display/product-display.component';
import { BlogDetailComponent } from 'src/app/blog-detail/blog-detail.component';
import { ListAssessmentComponent } from 'src/app/@theme/pages/assessments/list-assessment/list-assessment.component';

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css'],
 // imports: [HeaderFrontComponent, ProductDisplayComponent,RouterModule, FooterFrontComponent, SponsorsComponent, ClaimsComponent, ContractsComponent, PropertiesComponent, IncidentsComponent, BlogsComponent , BlogDetailComponent]
  imports: [HeaderFrontComponent, ProductDisplayComponent,RouterModule, 
            FooterFrontComponent, SponsorsComponent, 
            ListClaimComponentFront, AddClaimComponentFront, ModifyClaimComponentFront,ViewClaimComponentFront,
            ListAssessmentComponentFront, ViewAssessmentComponentFront,
            ContractsComponent, PropertiesComponent, IncidentsComponent, BlogsComponent, BlogDetailComponent]
})
export class AllTemplateFrontComponent {

}
