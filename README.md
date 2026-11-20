# Arma tu piñata

Proyecto base para el challenge de AWS en Nerdearla México. Arma tu propia piñata, decide qué trae adentro y publícala en AWS con [AWS Amplify](https://aws.amazon.com/amplify/hosting/?trk=54e40584-a59e-4b8d-a5b4-ecfbd722ff7e&sc_channel=el).

No necesitas instalar nada. Puedes hacer todo desde el navegador, también desde tu celular.

## Cómo se juega

Toca la piñata para pegarle. Si fallas, le pegas al aire. Cuando se rompe, toca los dulces para juntarlos.

## Lo que necesitas

- Una cuenta de GitHub
- Un navegador

## 1. Crea tu cuenta de AWS

Abre [este enlace para crear tu cuenta de AWS](https://signin.aws.amazon.com/signup?request_type=builderId&trk=54e40584-a59e-4b8d-a5b4-ecfbd722ff7e&sc_channel=el) y completa el registro. Si eres elegible para AWS Free Tier, tu cuenta empieza en el **Free plan**, con USD 100 en créditos. El Free plan no genera cargos mientras no cambies al Paid plan.

## 2. Haz un fork de este repositorio

1. Abre [este enlace para hacer un fork](https://github.com/anacunha/nerdearla-mx-pinata/fork).
2. Deja el nombre como está (o cámbialo si quieres) y haz clic en **Create fork**.

## 3. Arma tu piñata

En tu fork, abre cada archivo y haz clic en el lápiz para editarlo. Busca los `TODO`: cada uno explica qué cambiar y trae un ejemplo.

| TODO | Archivo | Qué decides |
|---|---|---|
| 1 | `index.html` | El nombre de tu fiesta |
| 2 | `index.html` | Lo que se grita cuando se rompe la piñata |
| 3 | `styles.css` | Los colores de tu piñata |
| 4 | `script.js` | Qué trae adentro: dulces, fruta o lo que quieras |
| 5 | `script.js` | Cuántos picos tiene |
| 6 | `script.js` | Cuántos golpes aguanta |
| 7 | `script.js` | Qué tanto se mueve |

Cuando termines con un archivo, haz clic en **Commit changes**.

### Temas

Este fork tiene varios temas. Cada uno cambia el nombre de la fiesta, el grito, los colores y lo que trae la piñata (los TODO 1 a 4), y todos viven en la lista `temas` al inicio de `script.js`. Quien juega elige el tema con los botones de arriba, y al romper la piñata puede pedir un **Tema sorpresa**. Para agregar un tema, copia uno de la lista y cámbiale los valores.

## 4. Publica tu piñata con Amplify

1. Abre la [consola de Amplify](https://console.aws.amazon.com/amplify/create/repo-branch?trk=54e40584-a59e-4b8d-a5b4-ecfbd722ff7e&sc_channel=el).
2. Elige **GitHub** y haz clic en **Next**.
3. En la ventana de GitHub, autoriza a Amplify. Cuando te pregunte a qué repositorios puede acceder, elige **Only select repositories** y selecciona tu fork.
4. Selecciona tu repositorio y la rama `main`.
5. En **App settings**, mira la configuración de build. Amplify revisó tu repositorio, vio que no hay framework y va a publicar los archivos tal como están. No cambies nada.
6. Haz clic en **Next** hasta llegar a **Save and deploy**.

Amplify descarga tu código, lo publica y te muestra el progreso. Tarda alrededor de un minuto.

## 5. Juega en tu URL

Cuando termine, haz clic en **Visit deployed URL**. Tu URL se ve así: `https://main.d1234abcd.amplifyapp.com`.

Ábrela en tu celular y rompe tu piñata.

## 6. Sigue cambiándola

¿Quieres más picos o que sea más difícil de romper? Edita el archivo en GitHub y haz commit. Amplify ve el cambio y publica una versión nueva de tu piñata, sin que hagas deploy a mano.
