import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { SCHOOL } from '../../school-info';
import { CLASSES } from '../../models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  social = SCHOOL;
  classes = CLASSES;
  eq = { name: '', phone: '', cls: CLASSES[0], msg: '' };
  eqOk = false;

  constructor(public store: StoreService) {}

  submitEq() {
    if (!this.eq.name.trim() || this.eq.phone.length !== 10) { alert('Naam aur 10-digit mobile zaroori hai'); return; }
    this.store.db.enquiries.push({ d: this.store.today(), name: this.eq.name.trim(), phone: this.eq.phone.trim(), cls: this.eq.cls, msg: this.eq.msg, status: 'new' });
    this.store.save();
    this.eq = { name: '', phone: '', cls: CLASSES[0], msg: '' };
    this.eqOk = true;
    setTimeout(() => (this.eqOk = false), 4000);
  }
}
