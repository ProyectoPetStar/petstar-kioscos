import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { 
  MatFormFieldModule, 
  MatInputModule, 
  MatSelectModule, 
  MatDatepickerModule, 
  MatNativeDateModule,
  MatCardModule,
  MatExpansionModule,
  MatSlideToggleModule
} from '@angular/material';
import { PipesCustomModule } from '../pipes/pipes.custom.module';
import { NgPipesModule } from 'ngx-pipes';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuPlantasComponent } from './menu-plantas/menu-plantas.component';
import { MenuKioscosComponent } from './menu-kioscos/menu-kioscos.component';
import { MenuAppWebComponent } from './menu-app-web/menu-app-web.component';
import { MenuBackgroundImageComponent } from './menu-background-image/menu-background-image.component';
import { AuthGuardAdmon } from '../auth/auth.guard.admon';
import { NotAuthGuard } from '../auth/not.auth.guard';
import { FormBackgroundImageComponent } from './form-background-image/form-background-image.component';
import { FormPlantasComponent } from './form-plantas/form-plantas.component';
import { FormKioscosComponent } from './form-kioscos/form-kioscos.component';
import { FormAppWebComponent } from './form-app-web/form-app-web.component';

/* expectedRole: number Es el id del rol que se encuentra en la base de datos */
const routesAdministracion: Routes = [
  {
    path: 'login', component: LoginComponent, canActivate: [ NotAuthGuard ]
  },
  {
    path: 'admin', component: AdminLayoutComponent,  canActivate:[AuthGuardAdmon], children: [
      {
          path:'Perfil',
          component: UserProfileComponent
      },
      {
          path:'Dashboard',
          component: DashboardComponent
      },
      {
          path:'Plantas',
          component: MenuPlantasComponent
      },
      {
          path:'Plantas/:id',
          component: FormPlantasComponent
      },
      {
          path:'Kioscos',
          component: MenuKioscosComponent
      },
      {
          path:'Kioscos/:id',
          component: FormKioscosComponent
      },
      {
          path:'Aplicaciones-Web',
          component: MenuAppWebComponent
      },
      {
          path:'Aplicaciones-Web/:id',
          component: FormAppWebComponent
      },
      {
          path:'Protector',
          component: MenuBackgroundImageComponent
      },
      {
          path:'Protector/:id',
          component: FormBackgroundImageComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatExpansionModule,
    MatSlideToggleModule,
    PipesCustomModule,
    NgPipesModule,
    RouterModule.forChild(routesAdministracion)
  ],
  declarations: [
    AdminLayoutComponent, 
    LoginComponent, 
    FooterComponent, 
    SidebarComponent, 
    NavbarComponent, 
    UserProfileComponent, 
    DashboardComponent, 
    MenuPlantasComponent, 
    MenuKioscosComponent, 
    MenuAppWebComponent, 
    MenuBackgroundImageComponent, 
    FormBackgroundImageComponent, FormPlantasComponent, FormKioscosComponent, FormAppWebComponent
  ],
  providers:[
    AuthGuardAdmon,
    NotAuthGuard,
    MatNativeDateModule
  ]
})
export class AdministracionModule { }
