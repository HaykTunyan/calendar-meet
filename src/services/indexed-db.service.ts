import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { openDB, IDBPDatabase } from 'idb';

export interface Appointment {
  id?: number; 
  title: string;
  time: string;
  date: string;
}

const DB_NAME = 'appointmentsDB';
const STORE_NAME = 'appointments';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {

  private db: IDBPDatabase | null = null;
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  constructor() {
    this.initDB();
  }

  async initDB() {
    if (typeof indexedDB === 'undefined') {
      console.error('❌ IndexedDB is not available in this environment.');
      return;
    }

    this.db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    this.loadAppointments();
  }

  async ensureDB() {
    if (!this.db) {
      await this.initDB();
    }
  }

  async addAppointment(appointment: Appointment): Promise<number | undefined> {
    await this.ensureDB();
    if (!this.db) return undefined;
    const tx = this.db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;
    const id = await store.add(appointment);
    return typeof id === 'number' ? id : Number(id);
  }

  async getAppointments(): Promise<Appointment[]> {
    await this.ensureDB();
    if (!this.db) return [];
    return await this.db.getAll(STORE_NAME);
  }

  async deleteAppointment(id: IDBValidKey) {
    await this.ensureDB();
    if (!this.db) return;
    const tx = this.db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;
    await store.delete(id);
  }

  async loadAppointments() {
    if (!this.db) return;
    const appointments = await this.db.getAll('appointments');
    this.appointmentsSubject.next(appointments); 
  }
}
