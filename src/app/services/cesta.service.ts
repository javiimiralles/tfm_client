import { Injectable } from '@angular/core';
import {ItemCestaInterface} from '../interfaces/item-cesta.interface';
import {BehaviorSubject} from 'rxjs';
import {Producto} from '../models/producto.model';
import {Proveedor} from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class CestaService {

  private cesta: ItemCestaInterface[] = [];
  private cestaSubject = new BehaviorSubject<ItemCestaInterface[]>([]);

  cesta$ = this.cestaSubject.asObservable();

  constructor() {
    this.loadCesta();
  }

  getCesta() {
    return this.cesta;
  }

  addProducto(producto: Producto, proveedor: Proveedor, cantidad: number) {
    const index = this.cesta.findIndex(item => item.producto.id === producto.id);
    if (index !== -1) {
      this.cesta[index].cantidad += cantidad;
    } else {
      this.cesta.push({ producto, proveedor, cantidad });
    }
    this.updateLocalStorage();
    this.cestaSubject.next(this.cesta);
  }

  removeProducto(productoId: number) {
    this.cesta = this.cesta.filter(item => item.producto.id !== productoId);
    this.updateLocalStorage();
    this.cestaSubject.next(this.cesta);
  }

  cleanCesta() {
    this.cesta = [];
    this.updateLocalStorage();
    this.cestaSubject.next(this.cesta);
  }

  private loadCesta() {
    const data = localStorage.getItem('cesta');
    if (data) {
      this.cesta = JSON.parse(data);
      this.cestaSubject.next(this.cesta); // Notificar los cambios a la UI
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('cesta', JSON.stringify(this.cesta));
  }
}
