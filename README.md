# 🚗 Workshop Management System

Sistema completo de gestión para talleres mecánicos construido con **Angular** + **Node.js/Express** + **Prisma ORM** + **SQL Server**.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#️-base-de-datos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Características

### Gestión de Trabajadores
- 👷 CRUD completo de mecánicos
- 📊 Seguimiento de salarios y contrataciones
- 🔍 Búsqueda y filtrado
- ✅ Soft delete (desactivación)

### Gestión de Vehículos
- 🚙 Registro de vehículos con propietarios
- 📝 Historial de trabajos por vehículo
- 🔎 Búsqueda por placa

### Gestión de Trabajos
- 📋 Creación y seguimiento de trabajos
- 💰 Control de montos y adelantos
- 📅 Fechas de inicio y finalización
- 🔄 Estados (pendiente, en progreso, completado)
- 💵 Sistema de adelantos integrado

### Vacaciones
- 🏖️ Solicitudes de vacaciones
- ⏱️ Cálculo automático de días
- ✅ Aprobación/Rechazo

### Facturación
- 🧾 Gestión de facturas de proveedores
- 💳 Registro de pagos
- 📊 Estados de pago (pendiente, parcial, pagado)
- 🔢 Cálculo automático de saldos

---

## 🛠️ Tecnologías

### Frontend
- **Angular 17** - Framework frontend
- **Angular Material** - Componentes UI
- **TypeScript** - Lenguaje principal
- **RxJS** - Programación reactiva
- **SCSS** - Estilos

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Framework web
- **TypeScript** - Lenguaje principal
- **Prisma ORM** - Acceso a BD type-safe
- **SQL Server** - Base de datos

### Características Técnicas
- ✅ **Type-Safety completo** (Frontend + Backend)
- ✅ **Conversión automática** camelCase ↔ snake_case
- ✅ **Validación de formularios** con Reactive Forms
- ✅ **Manejo de errores** con SnackBars
- ✅ **Relaciones automáticas** en Prisma
- ✅ **Hot reload** en desarrollo

---

## 📦 Requisitos Previos

- **Node.js** 18 o superior
- **npm** 8 o superior
- **SQL Server** (Express edition o superior)
- **Angular CLI** 17 (`npm install -g @angular/cli`)

---

## 🚀 Instalación

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd taller
```

### 2. Configurar Base de Datos

**Crear la base de datos en SQL Server:**
```sql
CREATE DATABASE WorkshopDB;
GO

-- Crear usuario
CREATE LOGIN workshop_user WITH PASSWORD = 'Workshop123!';
USE WorkshopDB;
CREATE USER workshop_user FOR LOGIN workshop_user;
GRANT ALL PRIVILEGES ON DATABASE::WorkshopDB TO workshop_user;
```

**Ejecutar el script inicial:**
```bash
# El script se encuentra en: backend/migrations/001_initial_schema.sql
# Ejecutarlo en SQL Server Management Studio o Azure Data Studio
```

### 3. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
```

**Editar `backend/.env`:**
```env
# Database Configuration
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=WorkshopDB
DB_USER=workshop_user
DB_PASSWORD=Workshop123!
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# Server Configuration
PORT=3000
NODE_ENV=development

# Prisma Database URL
DATABASE_URL="sqlserver://localhost;database=WorkshopDB;user=workshop_user;password=Workshop123!;encrypt=true;trustServerCertificate=true;instanceName=SQLEXPRESS"
```

**Generar Prisma Client:**
```bash
npm run prisma:generate
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

**Editar `frontend/src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 💻 Uso

### Iniciar Backend
```bash
cd backend
npm run dev
```
Servidor corriendo en: http://localhost:3000

### Iniciar Frontend
```bash
cd frontend
npm start
```
Aplicación corriendo en: http://localhost:4200

### Visualizar Base de Datos (Opcional)
```bash
cd backend
npm run prisma:studio
```
Prisma Studio en: http://localhost:5555

---

## 📁 Estructura del Proyecto

```
taller/
├── backend/                    # API Node.js
│   ├── prisma/
│   │   ├── schema.prisma      # Schema de Prisma (8 modelos)
│   │   └── migrations/        # Migraciones
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts      # Cliente Prisma
│   │   ├── models/            # Interfaces TypeScript
│   │   ├── repositories/      # Capa de datos (Prisma)
│   │   │   ├── job.repository.ts
│   │   │   ├── advance.repository.ts
│   │   │   ├── worker.repository.ts
│   │   │   ├── vehicle.repository.ts
│   │   │   ├── vacation.repository.ts
│   │   │   ├── invoice.repository.ts
│   │   │   └── invoice-payment.repository.ts
│   │   ├── routes/            # Endpoints API
│   │   └── index.ts           # Entry point
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/                   # App Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Servicios globales
│   │   │   ├── shared/        # Componentes compartidos
│   │   │   ├── workers/       # Módulo trabajadores
│   │   │   ├── vehicles/      # Módulo vehículos
│   │   │   ├── jobs/          # Módulo trabajos
│   │   │   ├── vacations/     # Módulo vacaciones
│   │   │   └── invoices/      # Módulo facturas
│   │   ├── environments/      # Configuración
│   │   └── styles.css         # Estilos globales
│   └── package.json
│
└── README.md                   # Este archivo
```

---

## 🔌 API Endpoints

### Workers (Trabajadores)
```
GET    /api/workers           # Listar trabajadores activos
GET    /api/workers/:id       # Obtener por ID
POST   /api/workers           # Crear trabajador
PUT    /api/workers/:id       # Actualizar
DELETE /api/workers/:id       # Desactivar (soft delete)
```

### Vehicles (Vehículos)
```
GET    /api/vehicles          # Listar vehículos
GET    /api/vehicles/:id      # Obtener por ID
POST   /api/vehicles          # Crear vehículo
PUT    /api/vehicles/:id      # Actualizar
DELETE /api/vehicles/:id      # Eliminar
```

### Jobs (Trabajos)
```
GET    /api/jobs              # Listar trabajos
GET    /api/jobs/:id          # Obtener por ID
POST   /api/jobs              # Crear trabajo
PUT    /api/jobs/:id          # Actualizar
DELETE /api/jobs/:id          # Eliminar
POST   /api/jobs/:id/advances # Registrar adelanto
```

### Vacations (Vacaciones)
```
GET    /api/vacations         # Listar vacaciones
GET    /api/vacations/:id     # Obtener por ID
POST   /api/vacations         # Crear solicitud
PUT    /api/vacations/:id     # Actualizar
DELETE /api/vacations/:id     # Eliminar
```

### Invoices (Facturas)
```
GET    /api/invoices          # Listar facturas
GET    /api/invoices/:id      # Obtener por ID
POST   /api/invoices          # Crear factura
PUT    /api/invoices/:id      # Actualizar
DELETE /api/invoices/:id      # Eliminar
```

### Invoice Payments (Pagos)
```
GET    /api/invoice-payments     # Listar pagos
POST   /api/invoice-payments     # Registrar pago
DELETE /api/invoice-payments/:id # Eliminar pago
```

---

## 🗄️ Base de Datos

### Modelos Prisma

El sistema usa **Prisma ORM** con los siguientes modelos:

#### Job (Trabajo)
- Relación con `Vehicle` (vehículo)
- Relación con `Worker` (mecánico)
- Múltiples `Advance` (adelantos)
- Campos: descripción, montos, fechas, estado

#### Worker (Trabajador)
- Múltiples `Job` (trabajos)
- Múltiples `Vacation` (vacaciones)
- Campos: nombre, documento, salario, fecha contratación

#### Vehicle (Vehículo)
- Múltiples `Job` (trabajos)
- Campos: placa (única), marca, modelo, propietario

#### Advance (Adelanto)
- Relación con `Job`
- Actualiza automáticamente `job.advanceAmount`

#### Invoice (Factura)
- Múltiples `InvoicePayment` (pagos)
- Cálculo automático de estado (pending/partial/paid)

### Características de Prisma

**Type-Safety Completo:**
```typescript
const job = await prisma.job.findFirst({
  include: { vehicle: true, worker: true }
});
job.vehicle.licensePlate  // ✅ Autocomplete
```

**Conversión Automática:**
```typescript
// Frontend: { vehicleId: 1, totalAmount: 1000 }
// DB: { vehicle_id: 1, total_amount: 1000 }
// Prisma convierte automáticamente
```

**Relaciones:**
```typescript
const job = await prisma.job.findUnique({
  where: { id: 1 },
  include: {
    vehicle: true,
    worker: true,
    advances: true
  }
});
```

---

## 📜 Scripts Disponibles

### Backend
```bash
npm run dev              # Desarrollo con hot reload
npm run build            # Compilar TypeScript
npm start                # Producción
npm run prisma:generate  # Generar Prisma Client
npm run prisma:studio    # UI visual de base de datos
npm run prisma:pull      # Sincronizar schema desde BD
npm run prisma:migrate   # Crear migración
```

### Frontend
```bash
npm start                # Desarrollo (http://localhost:4200)
npm run build            # Build producción
npm test                 # Tests unitarios
npm run lint             # Linter
```

---

## 🐛 Troubleshooting

### Backend

**Error: "Cannot find module '@prisma/client'"**
```bash
cd backend
npm run prisma:generate
```

**Error: "address already in use :::3000"**
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

**Error de conexión a SQL Server**
```bash
# Verificar que SQL Server está corriendo
# Verificar credenciales en .env
# Verificar que SQL Server Authentication está habilitado
```

**Ver datos visualmente**
```bash
cd backend
npm run prisma:studio
```

### Frontend

**Error al instalar dependencias**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error de CORS**
- Verificar que el backend tiene CORS habilitado
- Verificar que `apiUrl` en `environment.ts` es correcto

**Error al compilar**
```bash
# Limpiar caché de Angular
rm -rf .angular
npm start
```

---

## 🎨 Características Técnicas Destacadas

### Frontend
- ✅ **Reactive Forms** con validación
- ✅ **Angular Material** para UI consistente
- ✅ **Servicios compartidos** para API calls
- ✅ **Error handling** con SnackBars
- ✅ **Lazy loading** de módulos
- ✅ **Responsive design**

### Backend
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **Automatic case conversion** (camelCase ↔ snake_case)
- ✅ **Transaction support** para operaciones complejas
- ✅ **Relaciones automáticas** entre modelos
- ✅ **Repository pattern** para separación de responsabilidades
- ✅ **Error logging** detallado

---

## 🔐 Seguridad

- SQL Server con autenticación por usuario
- Variables de entorno para credenciales
- Validación de datos en frontend y backend
- Prepared statements (Prisma automáticamente)
- CORS configurado

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

ISC

---

## 👥 Equipo

Workshop Management System Team

---

## 📞 Soporte

Para preguntas o problemas, crear un issue en el repositorio.
