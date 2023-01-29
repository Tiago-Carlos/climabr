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
  isHistoryVisible = false;

  constructor(
    private readonly cityService: SearchCityService,
    private readonly router: Router,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
    await this.loadHistory();
    await this.storage.get("history").then(async(hist) => {
      if (!hist) {
        console.log("Troquei pra true on init")
        this.isHistoryVisible = false
        await this.storage.set("history", [])
      }
      else if (hist.length != 0) {
        this.isHistoryVisible = true
      }
    });
  }

  async onSearch(query: string) {
    try {
      this.errorMessage = null;
      if (query === "") {
        console.log("Troquei pra true on search")
        this.isHistoryVisible = true
      }
      else {
        console.log("Troquei pra false on search")
        this.isHistoryVisible = false;
        this.cities = await this.cityService.searchByName(query);
      }
    } catch (error) {
      this.errorMessage = error.message
    }
  }

  async loadHistory() {
    try {
      this.errorMessage = null;
      await this.storage.get("history").then(async (hist) => {
        if (!hist) { return; }
        await hist.forEach(async (id:number) => {
          this.history.push(await this.cityService.searchById(id))
        });
      })
    }
    catch (error) {
      this.errorMessage = error.message
    }
  }

  async onSelect(city: City) {
    await this.router.navigateByUrl(`/weather/${city.id}`, { replaceUrl: true })
    var arr : number[] = []
    await this.storage.get("history").then(async(hist) => {
      arr = hist
      let index = arr.indexOf(city.id)
      if (index != -1) {
        console.log("queimei: " + index)
        arr.splice(index, 1)
      }
      console.log(" gravei " + index)
      arr.unshift(city.id)
      await this.storage.set("history", arr)
    })
  }
}
