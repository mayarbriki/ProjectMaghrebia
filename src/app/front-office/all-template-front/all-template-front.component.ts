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
import { ClaimsComponent } from '../claims/claims.component';
import { ContractsComponent } from "../contracts/contracts.component";
import { IncidentFormComponent } from '../incidents/incident-form/incident-form.component';
import { PropertiesComponent } from "../../@theme/pages/property/properties/properties.component";
import { PropertiessComponent } from "../property/properties/properties.component";

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css'],
  imports: [HeaderFrontComponent, RouterModule, FooterFrontComponent, SponsorsComponent, ClaimsComponent, ContractsComponent, IncidentFormComponent, PropertiesComponent, PropertiessComponent]
})
export class AllTemplateFrontComponent {

}
