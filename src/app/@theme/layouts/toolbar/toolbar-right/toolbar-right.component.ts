// Angular import
import { Component } from '@angular/core';

// Project import
import { SharedModule } from 'src/app/demo/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './toolbar-right.component.html',
  styleUrls: ['./toolbar-right.component.scss']
})
export class NavRightComponent {
  // public props
  mainCards = [
    {
      day: 'Today',
      cards: [
        {
          icon: 'custom-document-text',
          time: '10 min ago',
          position: 'Policy Approval',
          description: "New insurance policy #MTN-10234 is pending admin approval.",
          status: false
        },
        {
          icon: 'custom-shield',
          time: '30 min ago',
          position: 'Risk Assessment',
          description: "Risk assessment completed for corporate client 'TunisCorp'.",
          status: false
        },
        {
          icon: 'custom-sms',
          time: '1 hour ago',
          position: 'Client Inquiry',
          description: "Client 'A. Ben Salah' has requested clarification on life insurance benefits.",
          status: false
        }
      ]
    },
    {
      day: 'Yesterday',
      cards: [
        {
          icon: 'custom-security-safe',
          time: '12 hour ago',
          position: 'Fraud Alert',
          description: "Potential fraudulent claim detected. Verification needed.",
          status: true
        },
        {
          icon: 'custom-user-bold',
          time: '15 hour ago',
          position: 'New Agent Added',
          description: "New insurance agent 'H. Mejri' registered under branch #TN-SFAX.",
          status: true
        },
        {
          icon: 'custom-document-text',
          time: '18 hour ago',
          position: 'Claim Processing',
          description: "Claim #CLM-75984 has been processed successfully.",
          status: false
        }
      ]
    }
  ];

  notification = [
    {
      sub_title: 'Security Update',
      time: '5 hour ago',
      title: 'Two-Factor Authentication Enabled',
      img: 'assets/images/layout/img-announcement-1.png'
    },
    {
      sub_title: 'New Product',
      time: '10 hour ago',
      title: 'Launch of Premium Health Insurance Plan',
      img: 'assets/images/layout/img-announcement-2.png'
    }
  ];
}
