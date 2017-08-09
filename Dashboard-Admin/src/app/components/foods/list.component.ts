import { Component, OnInit } from '@angular/core';
import { FoodService } from "app/services/food.service";
import { Food } from "app/models/food";
import { ContentUrl } from "app/shared/constants";

@Component({
  selector: 'app-foods-list',
  template: `
  <div class="ui container basic segment" [ngClass]="{ loading : isLoading }">
    <table class="ui selectable celled table">
      <thead class="full-width">
        <tr>
          <th>#</th>
          <th>Picture</th>
          <th>Name</th>
          <th>Description</th>
          <th>Category</th>
          <th>Price</th>
          <th class="right aligned">Edit / Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let food of foods ;let i = index">
          <td class="collapsing">{{i}}. </td>

          <td class="collapsing">
            <img [src]="food.picture" class="ui mini rounded image">
          </td>

          <td>{{food.name}}</td>

          <td>{{food.description}}</td>

          <td>
            <span class="ui green">{{food.category?.name}}</span>
          </td>

          <td class="collapsing">{{food.price}}</td>

          <td class="right aligned collapsing">
            <a [routerLink]="['/foods/create']" [queryParams]="{ id : food.id}">Edit</a> /
            <a href="#">Delete</a>
          </td>
        </tr>
      </tbody>
      <tfoot class="full-width">
        <tr>
          <th colspan="7">
            <a routerLink="/foods/create" class="ui right floated small primary labeled icon button">
              <i class="plus icon"></i> Create food
          </a>
          </th>
        </tr>
      </tfoot>
    </table>
  </div>`
})
export class FoodListComponent implements OnInit {
  contentUrl = ContentUrl;
  foods: Food[]
  isLoading: boolean;

  constructor(private foodService: FoodService) { }

  ngOnInit() {
    this.isLoading = true;
    this.foodService.getAll().subscribe(foods => {
      foods.forEach(f => {
        f.picture = ContentUrl + f.picture;
      });
      this.foods = foods;
      this.isLoading = false;
    });
  }
}
