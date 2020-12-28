import Alerts from "helpers/Alerts";
import DB from "helpers/db";
import Router from "next/router";

class Controller {
  constructor() {
    this.alerts = new Alerts();
  }

  errorsHandler = (error, retryHandler, isStrict) => {
    console.error("%c Error > %c", "background:red; color:white", "", error);

    if (error.isAxiosError) {
      if (error.response) {
        if (error.response.status === 422) {
          switch (error.response.data.msg) {
            case "error-incorrect-password":
              return this.alerts.showAlert(
                "Revise la contrasena ingresado...",
                "Contrasena incorrecta!",
                true,
                (e) => {
                  document.getElementById("input-password").focus();
                }
              );

            case "error-unexist-email":
              return this.alerts.showAlert(
                "Revise el correo electrónico ingresado...",
                "Correo electrónico no encontrado!",
                true,
                (e) => {
                  document.getElementById("input-email").focus();
                }
              );

            case "error-already-exist-email":
              return this.alerts.showAlert(
                "Ingrese otro correo...",
                "Correo electrónico ya registrado!",
                true,
                (e) => {
                  document.getElementById("input-email").focus();
                }
              );

            case "error-already-exist-username":
              return this.alerts.showAlert(
                "Ingrese otro nombre...",
                "nombre de cuenta ya registrado!",
                true,
                (e) => {
                  document.getElementById("input-username").focus();
                }
              );

            default:
              return this.alerts.showAlert("Revise los datos ingresados");
          }
        } else if (error.response.status === 406) {
          return this.alerts.showWarning("Contraseña incorrecta");
        } else if (error.response.status === 401) {
          return this.alerts.showWarning(
            "Deve volver a iniciar sesión",
            "Ups... Su sesión caducó",
            true,
            () => {
              DB.clear("userData");
              DB.set("targetPage", document.location.href);
              Router.push("/login");
            }
          );
        } else {
          return this.alerts.showErrorUnknow(retryHandler, isStrict);
        }
      } else {
        return this.alerts.showErrorConexion(retryHandler, isStrict);
      }
    } else {
      return this.alerts.showErrorUnknow(retryHandler, isStrict);
    }
  };
}

export default Controller;
