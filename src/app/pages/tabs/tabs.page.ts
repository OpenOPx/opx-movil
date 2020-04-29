import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { OfflineManagerService } from 'src/app/servicios/offline-manager.service';
import { NetworkService, ConnectionStatus } from 'src/app/servicios/network.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(
    private platform: Platform,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });
    });
  }
}
