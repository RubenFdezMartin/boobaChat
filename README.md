# BoobaChat

BoobaChat es una API de chat en vivo que imita la funcionalidad de aplicaciones de mensajería como WhatsApp. 
Permite a los usuarios enviar y recibir mensajes en tiempo real, almacenando los mensajes en una base de datos 
para su persistencia. Este chat es ideal para conversaciones rápidas y sencillas, integrando tecnologías modernas 
para una experiencia de usuario fluida.

## Características
- Mensajería en tiempo real utilizando Socket.IO
- Almacenamiento persistente de mensajes en la base de datos
- Interfaz sencilla y rápida para el usuario
- Generación de usuarios aleatorios a través de una API externa

## Stack Tecnológico
- **Frontend:** HTML, CSS, JavaScript (VanillaJS)
- **Backend:** Node.js, Express.js
- **Base de datos:** MySQL (Base de datos de Turso)
- **Comunicación en tiempo real:** Socket.IO
- **Módulos:** ECMAScript Modules

## API de Usuarios
- Generación de usuarios aleatorios utilizando la API de random-data-api: [https://random-data-api.com/api/users/random_user]

## Autor
Rubén Fernández Martín

## Guía de Instalación

### Requisitos
- Node.js
- MySQL (asegúrate de que la base de datos esté configurada)

### Instalación
1. Clona el repositorio:

   git clone https://github.com/rubenfdezmartin/boobaChat.git
   
2. Accede al repositorio:

    cd boobaChat

3. Instala las dependencias definidas en el archivo package.json:

   npm install

4. Modifica los valores del archivo .env:
   
   Asegúrate de que este archivo no se suba a ningún repositorio público, ya que contiene información sensible.

5. Inicia el servidor
   
   npm run dev