import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { City } from '../domain/entities/city.model';
import { SearchCityService } from '../domain/services/search-city.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  errorMessage = null;
  cities: City[] = [];
  history: City[] = [];
  isHistoryVisible = true;

  constructor(
    private readonly cityService: SearchCityService,
    private readonly router: Router,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
    await this.loadHistory();
  }

  async onSearch(query: string) {
    try {
      this.errorMessage = null;
      this.cities = await this.cityService.searchByName(query);
      this.isHistoryVisible = false;
    } catch (error) {
      this.errorMessage = error.message
    }
  }

  async loadHistory() {
    try {
      this.errorMessage = null;
      this.history = []
      this.storage.forEach((value) =>{
        this.history.push(value)
      })
      console.log(this.history)
    }
    catch (error) {
      this.errorMessage = error.message
    }
  }

  async onSelect(city: City) {
    await this.router.navigateByUrl(`/weather/${city.id}`, { replaceUrl: true })
    await this.storage.set(city.name, city)
  }
}
