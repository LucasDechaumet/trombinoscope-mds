import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrombinoscopeGeneralComponent } from './trombinoscope-general.component';

describe('TrombinoscopeGeneralComponent', () => {
  let component: TrombinoscopeGeneralComponent;
  let fixture: ComponentFixture<TrombinoscopeGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrombinoscopeGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrombinoscopeGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
