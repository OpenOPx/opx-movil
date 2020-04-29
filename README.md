# Aplicación Móvil OPC

[OPC](http://opx.cali.gov.co/) es una aplicación desarrollada en Ionic versión 4 en un marco de código abierto.

## Plugins usados
Consume los servicios del dispositivo a través de los plugins ofrecidos por Ionic Cordova
| Nombre |Paquete| 	Versión |
|--|--|--|
|[Network](https://ionicframework.com/docs/native/network)|`@ionic-native/network`|`^5.15.1`|
|[TextToSpeech](https://ionicframework.com/docs/native/text-to-speech)|`@ionic-native/text-to-speech`| `^5.16.0`|
|[Geolocation](https://ionicframework.com/docs/native/geolocation)|`@ionic-native/geolocation`|`^5.18.0`|
|[InAppBrowser](https://ionicframework.com/docs/native/in-app-browser)|`@ionic-native/in-app-browser`|`^5.15.0`
|[Storage](https://ionicframework.com/docs/building/storage)|`@ionic/storage`|`2.2.0`|



# Primeros pasos
Antes de continuar, asegúrese de que su computador tenga [Node.js](https://ionicframework.com/docs/faq/glossary#node) instalado. Ver [estas instrucciones](https://ionicframework.com/docs/installation/environment) para configurar un entorno para Ionic.

Después de descargar o clonar el proyecto y estar ubicado en la carpeta raíz se deben instalar los paquetes necesarios:

- `npm install`

Seguidamente, ejecutar el proyecto de manera local

 - `ionic s`

# Estructura del proyecto
Distribuido por carpetas la aplicación permite una fácil y distribuida gestión.

 - **Servicios:**
 Directorio que contiene las funciones principales y comunes en el sistema, funciones y peticiones al Web Services.
 
 - **Pipes:**
 Clases cuya característica principal es de transformar datos de entrada. Se realiza con el fin de centralizar controladores y evitar *duplicar* código.
 
 - **Interfaces:**
 Declaración de los todos los objetos usados en la plataforma. Dado que el proyecto tiene incorporado Typescript es muy útil para el desarrollador.
 
 - **Guards:**
 Controla el acceso a módulos o componentes que no tengan una autenticación válida.
 
 - **Componentes:**
 Componentes que no son dependientes por página o vista de la aplicación móvil. Pueden ser usados en cualquier momento, por ejemplo el popup de ***Inicio de sesión***.
 
 - **Páginas:**
 Distribución de las vistas relacionadas con la aplicación móvil. Cada carpeta representa una pestaña en la vista principal.
 -- **Explora:** Vista del mapa asociado a la ciudad de Cali, consumiendo los servicios `wms` desde `http://ws-idesc.cali.gov.co:8081`.
 Si el usuario tiene perfil de proyectista, podrá realizar proceso relacionados a él, como seleccionar tareas, editar y eliminar equipos.
 -- **Perfil:** Pestaña que permite realizar todas las funciones del usuario que actualmente se encuentra logueado, editar su información personal.
 -- **Proyectos:** Lista de los proyectos asociados al perfil como también el acceso al detalle de cada uno. El usuario podrá observar las tareas que pertenecen al proyecto en particular. De la misma manera, entrar al detalle de cada tarea y posiblemente realizar lo solicitado.
 -- **Tareas:** Muestra todas las tareas asociadas al usuario actual. Puede ingresar en cada una de ellas y realizar la respectiva tarea.
 


# Publicación

Para [generar](https://ionicframework.com/docs/cli/commands/cordova-build) un archivo `.apk` y probarlo directamente en un dispositivo android real se deben ejecutar los siguientes comandos:

 - Pruebas `ionic cordova build android `
 - Producción `ionic cordova build android --prod`
