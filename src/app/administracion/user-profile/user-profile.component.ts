import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CatalogoPerfil } from '../../models/catalogo-perfil';
import { notify } from '../../utils';
import swal from 'sweetalert2';

declare const $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [UserProfileService]
})
export class UserProfileComponent implements OnInit {

  public usuario: User;
  public password: any;
  public mensaje_error: string;
  public loading: boolean;
  public formularioPerfil: FormGroup;
  public formularioPwd: FormGroup;
  public submittedPerfil: boolean;
  public submittedPwd: boolean;
  public mensajePwd: string;

  constructor(
    private service: UserProfileService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {

    this.loading = true;
    this.submittedPerfil = false;
    this.submittedPwd = false;
    this.password = {
      actual: '',
      nueva: '',
      confirmacion: ''
    };
    this.mensajePwd = '';
    this.usuario = new User(-1, '', '', '', '', '', -1, -1, '', new CatalogoPerfil(-1, '', '', -1));

    if (this.auth.getIdUsuario() != null) {
      this.service.getUsuarioById(this.auth.getIdUsuario()).subscribe(result => {

        if (result.response.sucessfull) {
          this.usuario = result.data.usuario;
          this.loading = false;
          this.loadFormulario();
        } else {
          // Materialize.toast(result.response.message, 4000, 'red');
          notify(result.response.message, 'danger', 4000);
          this.loading = false;
        }
      }, error => {
        // Materialize.toast('Ocurrió  un error en el servicio!', 4000, 'red');
        notify('Ocurrió  un error en el servicio!', 'danger', 4000);
        this.loading = false;
      }
      );
    }
  }

  loadFormulario(): void {

    this.formularioPerfil = this.fb.group({
      usuario: new FormControl({ value: this.usuario.usuario, disabled: false }, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]),
      correo_electronico: new FormControl({ value: this.usuario.correo_electronico, disabled: false }, [Validators.required, Validators.pattern(/^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/)]),
      nombre_usuario: new FormControl({ value: this.usuario.nombre_usuario, disabled: false }, [Validators.required, Validators.pattern(/(\w(\s)?)+/)]),
      apellidos: new FormControl({ value: this.usuario.apellidos, disabled: false }, [Validators.required, Validators.pattern(/(\w(\s)?)+/)])
    });

    this.formularioPwd = this.fb.group({
      actual: new FormControl({ value: this.password.actual, disabled: false }, [Validators.required]),
      nueva: new FormControl({ value: this.password.nueva, disabled: false }, [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]),
      confirmacion: new FormControl({ value: this.password.confirmacion, disabled: false }, [Validators.required])
    });

  }

  updatePerfil(ev, accion) {
    ev.preventDefault();

    this.submittedPerfil = true;

    if (this.formularioPerfil.valid) {

      /* 
     * Configuración del modal de confirmación
     */
      swal({
        title: '<span style="color: #303f9f ">¿ Está seguro de actualizar su perfil ?</span>',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {

          this.service.updateUser(this.auth.getIdUsuario(), this.usuario).subscribe(result => {
            if (result.response.sucessfull) {
              swal('Actualizado!', 'Ha actualizado su perfil', 'success')
            } else {
              swal('Oops...', result.response.message, 'error')
            }
          }, error => {
            swal('Oops...', 'Ocurrió  un error en el servicio!', 'error')
          });
          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
          // this.disabledBtn = false;
        }
      })
    } else {
      notify('Verifique los datos capturados!', 'danger', 2800);
    }


  }


  changePwd(ev, accion) {
    ev.preventDefault();

    this.submittedPwd = true;

    if (this.formularioPwd.valid) {

      /* 
     * Configuración del modal de confirmación
     */
      swal({
        title: '<span style="color: #303f9f ">¿ Está seguro de actualizar su contraseña ?</span>',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#303f9f',
        cancelButtonColor: '#9fa8da ',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si!',
        allowOutsideClick: false,
        allowEnterKey: false
      }).then((result) => {
        /*
         * Si acepta
         */
        if (result.value) {

          this.service.changePassword(this.auth.getIdUsuario(), this.password.actual, this.password.nueva).subscribe(result => {
            if (result.response.sucessfull) {
              swal('Actualizada!', 'Ha actualizado su contraseña', 'success')
            } else {
              swal('Oops...', result.response.message, 'error')
            }
          }, error => {
            swal('Oops...', 'Ocurrió  un error en el servicio!', 'error')
          });
          /*
          * Si cancela accion
          */
        } else if (result.dismiss === swal.DismissReason.cancel) {
          // this.disabledBtn = false;
        }
      })
    } else {
      notify('Verifique los datos capturados!', 'danger', 2800);
    }


  }

  clearMsj() {
    console.log(this.password.nueva,this.password.confirmacion )
    if (this.password.nueva === this.password.confirmacion) {
      this.mensajePwd = '';
    } else {
      this.mensajePwd = 'Las contraseñas no coinciden';
    }

  }


}
