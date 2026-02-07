# Workshop Management System - Backend API

Sistema de gestión para talleres mecánicos construido con Node.js, TypeScript, Express y Prisma ORM.

## 🚀 Tecnologías

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - Acceso a base de datos type-safe
- **SQL Server** - Base de datos
- **Nodemon** - Hot reload en desarrollo

## 📋 Requisitos Previos

- Node.js 18+ 
- SQL Server Express (o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   # Database Configuration
   DB_SERVER=DESKTOP-QT2JA00\SQLEXPRESS
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

4. **Configurar la base de datos**

   Ejecuta el script SQL inicial para crear las tablas:
   ```bash
   # El script se encuentra en: migrations/001_initial_schema.sql
   # Ejecutarlo en SQL Server Management Studio o Azure Data Studio
   ```

5. **Generar Prisma Client**
   ```bash
   npm run prisma:generate
   ```

## 🎮 Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia el servidor en modo desarrollo con hot reload
```

### Producción
```bash
npm run build        # Compila TypeScript a JavaScript
npm start            # Inicia el servidor en producción
```

### Prisma
```bash
npm run prisma:generate    # Genera el Prisma Client
npm run prisma:studio      # Abre Prisma Studio (UI visual para ver datos)
npm run prisma:pull        # Sincroniza schema desde la base de datos
npm run prisma:migrate     # Crea y aplica migraciones
npm run prisma:deploy      # Aplica migraciones en producción
```

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema de Prisma con modelos
│   └── migrations/            # Migraciones de Prisma
├── src/
│   ├── config/
│   │   └── prisma.ts          # Cliente singleton de Prisma
│   ├── models/                # Interfaces TypeScript
│   │   ├── job.model.ts
│   │   ├── worker.model.ts
│   │   ├── vehicle.model.ts
│   │   └── ...
│   ├── repositories/          # Acceso a datos con Prisma
│   │   ├── job.repository.ts
│   │   ├── advance.repository.ts
│   │   ├── worker.repository.ts
│   │   ├── vehicle.repository.ts
│   │   ├── vacation.repository.ts
│   │   ├── invoice.repository.ts
│   │   └── invoice-payment.repository.ts
│   ├── routes/                # Rutas de la API
│   │   ├── job.routes.ts
│   │   ├── worker.routes.ts
│   │   ├── vehicle.routes.ts
│   │   └── ...
│   └── index.ts              # Punto de entrada
├── .env                       # Variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Workers (Trabajadores)
- `GET    /api/workers` - Listar todos los trabajadores activos
- `GET    /api/workers/:id` - Obtener trabajador por ID
- `POST   /api/workers` - Crear nuevo trabajador
- `PUT    /api/workers/:id` - Actualizar trabajador
- `DELETE /api/workers/:id` - Desactivar trabajador (soft delete)

### Vehicles (Vehículos)
- `GET    /api/vehicles` - Listar todos los vehículos
- `GET    /api/vehicles/:id` - Obtener vehículo por ID
- `POST   /api/vehicles` - Crear nuevo vehículo
- `PUT    /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Jobs (Trabajos)
- `GET    /api/jobs` - Listar todos los trabajos
- `GET    /api/jobs/:id` - Obtener trabajo por ID
- `POST   /api/jobs` - Crear nuevo trabajo
- `PUT    /api/jobs/:id` - Actualizar trabajo
- `DELETE /api/jobs/:id` - Eliminar trabajo
- `POST   /api/jobs/:id/advances` - Registrar adelanto para un trabajo

### Vacations (Vacaciones)
- `GET    /api/vacations` - Listar todas las vacaciones
- `GET    /api/vacations/:id` - Obtener vacación por ID
- `POST   /api/vacations` - Crear solicitud de vacación
- `PUT    /api/vacations/:id` - Actualizar vacación
- `DELETE /api/vacations/:id` - Eliminar vacación

### Invoices (Facturas)
- `GET    /api/invoices` - Listar todas las facturas
- `GET    /api/invoices/:id` - Obtener factura por ID
- `POST   /api/invoices` - Crear nueva factura
- `PUT    /api/invoices/:id` - Actualizar factura
- `DELETE /api/invoices/:id` - Eliminar factura

### Invoice Payments (Pagos de Facturas)
- `GET    /api/invoice-payments` - Listar todos los pagos
- `GET    /api/invoice-payments/:id` - Obtener pago por ID
- `POST   /api/invoice-payments` - Registrar nuevo pago
- `DELETE /api/invoice-payments/:id` - Eliminar pago

## 🗄️ Modelos de Datos (Prisma)

### Job
```typescript
{
  id: number;
  vehicleId: number;        // Relación con Vehicle
  workerId: number;         // Relación con Worker
  description: string;
  totalAmount: Decimal;
  advanceAmount: Decimal;
  status: string;          // 'pending', 'in_progress', 'completed'
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  vehicle: Vehicle;
  worker: Worker;
  advances: Advance[];
}
```

### Worker
```typescript
{
  id: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  phone: string;
  email: string;
  hireDate: Date;
  baseSalary: Decimal;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  jobs: Job[];
  vacations: Vacation[];
}
```

### Vehicle
```typescript
{
  id: number;
  licensePlate: string;    // Único
  brand: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  createdAt: Date;
  
  // Relaciones
  jobs: Job[];
}
```

## 🎨 Características de Prisma

### Type-Safety Completo
```typescript
// ✅ TypeScript conoce todos los campos y relaciones
const job = await prisma.job.findFirst({
  include: { vehicle: true, worker: true }
});

job.vehicle.licensePlate  // ✅ Autocomplete
job.vehicle.randomField   // ❌ Error de compilación
```

### Conversión Automática camelCase ↔ snake_case
```typescript
// Frontend envía: { vehicleId: 1, totalAmount: 1000 }
// Prisma convierte a: { vehicle_id: 1, total_amount: 1000 }
// Base de datos recibe snake_case automáticamente
```

### Relaciones Fáciles
```typescript
// Cargar datos relacionados
const job = await prisma.job.findUnique({
  where: { id: 1 },
  include: {
    vehicle: true,
    worker: true,
    advances: true
  }
});
```

### Transacciones
```typescript
await prisma.$transaction(async (tx) => {
  await tx.advance.create({ ... });
  await tx.job.update({ ... });
});
```

## 🔐 Autenticación SQL Server

El proyecto usa **SQL Authentication**. Asegúrate de:

1. Crear el usuario en SQL Server:
   ```sql
   CREATE LOGIN workshop_user WITH PASSWORD = 'Workshop123!';
   CREATE USER workshop_user FOR LOGIN workshop_user;
   GRANT ALL PRIVILEGES ON DATABASE WorkshopDB TO workshop_user;
   ```

2. Habilitar SQL Server Authentication en SQL Server Configuration Manager

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### Error: "address already in use :::3000"
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Ver datos de la base de datos visualmente
```bash
npm run prisma:studio
# Abre en http://localhost:5555
```

### Sincronizar schema desde la base de datos
```bash
npm run prisma:pull
npm run prisma:generate
```

## 📝 Convenciones de Código

- **Frontend/API**: `camelCase` (vehicleId, totalAmount)
- **Base de Datos**: `snake_case` (vehicle_id, total_amount)
- **Prisma**: Convierte automáticamente entre ambos

## 🤝 Contribuir

1. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
2. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

Workshop Management System Team
