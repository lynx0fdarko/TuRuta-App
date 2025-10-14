# EnRuta 🚍

Aplicación móvil desarrollada en **React Native + Expo** para Nicaragua Hackathon 2025.  
EnRuta conecta a los usuarios con información en tiempo real de **paradas de buses, recorridos y rutas favoritas**, con integración de geolocalización y Supabase para autenticación.

---

## ✨ Características

- 🔐 **Autenticación** con Supabase (login, registro y acceso como invitado).
- 🗺️ **Mapa interactivo** con `react-native-maps` y geolocalización usando Expo Location.
- 📍 **Paradas cercanas** con horarios de buses.
- ⭐ **Rutas favoritas** guardadas por el usuario.
- 📊 **UI moderna** con Bottom Sheets, Blur Views y animaciones.
- 📱 Disponible en **iOS y Android**.

---

## 📂 Estructura del Proyecto

- `/app` → Pantallas (login, signup, home (viajes recientes, favoritos), map, Routes, Account info).
- `/components` → Componentes reutilizables (`FloatingBar`, `MapScaffold`).
- `/lib` → Servicios (ej. `supabase.js`, `location.js`).
- `/styles` → Estilos globales (`colors`, `typography`, `layout`, etc.).

---

## ⚡ Instalación y Ejecución

Requisitos:  
- Node.js >= 20 (LTS) 
- Expo CLI  
- Cuenta en [Supabase](https://supabase.com)  

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/enruta.git
   cd enruta
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` con tus credenciales de Supabase:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=tu-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. Levantar la app:
   ```bash
   npm start -c
   ```

---

## 🛠️ Tecnologías

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com)
- [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Gorhom Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- [Vercel](https://vercel.com)

---

## 🤝 Equipo

Hackathon Nicaragua 2025 – Proyecto **EnRuta**  
Desarrollado para el reto de movilidad urbana y transporte inteligente.  

---

## 📜 Licencia

Este proyecto está licenciado bajo la **MIT License**:

```
MIT License

Copyright (c) 2025 EnRuta

Se concede permiso, libre de cargos, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"),
para utilizar el Software sin restricción, incluyendo sin limitación los derechos
a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender
copias del Software, y a permitir a las personas a las que se les proporcione el
Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
copias o partes sustanciales del Software.

EL SOFTWARE SE ENTREGA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN,
IDONEIDAD PARA UN PROPÓSITO PARTICULAR E INCUMPLIMIENTO. EN NINGÚN CASO LOS
AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN,
DAÑO O OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN CONTRACTUAL, AGRAVIO O
CUALQUIER OTRA MANERA, QUE SURJA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U
OTRAS INTERACCIONES CON EL SOFTWARE.
```

---

🚀 **EnRuta** – Escoge tu destino, nosotros tu ruta!
