# 🎯 Cómo crear un nuevo recurso (CRUD)

Esta guía te enseña paso a paso cómo crear un nuevo recurso completo usando la plantilla del proyecto.

## Ejemplo: Crear recurso "Products" (Productos)

Vamos a crear un CRUD completo para productos con los campos:

- `name` (string, requerido)
- `description` (string, opcional)
- `price` (decimal)
- `stock` (integer)
- `userId` (relación con User)

---

## Paso 1: Añadir el modelo en Prisma

Edita `prisma/schema.prisma` y añade el nuevo modelo:

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  stock       Int      @default(0)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("products")
}
```

También añade la relación en el modelo `User`:

```prisma
model User {
  // ... campos existentes
  tasks    Task[]
  products Product[]  // ← Añadir esta línea
}
```

---

## Paso 2: Crear y aplicar la migración

```bash
# Opción 1: Docker
docker compose exec backend npx prisma migrate dev --name add_products

# Opción 2: Local
npm run prisma:migrate
# Cuando te pida el nombre, escribe: add_products

# Generar Prisma Client actualizado
npx prisma generate
# o
npm run prisma:generate
```

Esto creará las tablas en la base de datos y actualizará el cliente de Prisma con los nuevos tipos.

---

## Paso 3: Copiar la plantilla

```bash
# Copiar la carpeta template-resource
cp -r src/modules/template-resource src/modules/products

# Renombrar archivos
cd src/modules/products
mv template.schemas.ts products.schemas.ts
mv template.service.ts products.service.ts
mv template.controller.ts products.controller.ts
mv template.routes.ts products.routes.ts
```

---

## Paso 4: Actualizar schemas (products.schemas.ts)

Edita el archivo y reemplaza `Template` por `Product`:

```typescript
import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    price: z.number().positive("El precio debe ser positivo"),
    stock: z
      .number()
      .int()
      .nonnegative("El stock no puede ser negativo")
      .default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    name: z.string().min(1, "El nombre es requerido").optional(),
    description: z.string().optional(),
    price: z.number().positive("El precio debe ser positivo").optional(),
    stock: z
      .number()
      .int()
      .nonnegative("El stock no puede ser negativo")
      .optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("10"),
    search: z.string().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>["query"];
```

---

## Paso 5: Actualizar service (products.service.ts)

Reemplaza las referencias a `template` por `product`:

```typescript
import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "./products.schemas.js";

export class ProductsService {
  async getProducts(userId: string, query: GetProductsQuery) {
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.search && {
        name: {
          contains: query.search,
          mode: "insensitive" as const,
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId: string, userId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId,
      },
    });

    if (!product) {
      throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async createProduct(userId: string, data: CreateProductInput) {
    const product = await prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });

    return product;
  }

  async updateProduct(
    productId: string,
    userId: string,
    data: UpdateProductInput,
  ) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId,
      },
    });

    if (!existingProduct) {
      throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return product;
  }

  async deleteProduct(productId: string, userId: string) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId,
      },
    });

    if (!existingProduct) {
      throw new AppError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return { message: "Producto eliminado exitosamente" };
  }
}
```

---

## Paso 6: Actualizar controller (products.controller.ts)

```typescript
import type { Request, Response, NextFunction } from "express";
import { ProductsService } from "./products.service.js";
import { successResponse } from "../../utils/response.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  GetProductsQuery,
} from "./products.schemas.js";

const productsService = new ProductsService();

export class ProductsController {
  async getProducts(
    req: Request<object, object, object, GetProductsQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;
      const result = await productsService.getProducts(userId, req.query);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;
      const product = await productsService.getProductById(
        req.params.id,
        userId,
      );
      res.json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request<object, object, CreateProductInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;
      const product = await productsService.createProduct(userId, req.body);
      res.status(201).json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request<{ id: string }, object, UpdateProductInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;
      const product = await productsService.updateProduct(
        req.params.id,
        userId,
        req.body,
      );
      res.json(successResponse(product));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user!.id;
      const result = await productsService.deleteProduct(req.params.id, userId);
      res.json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}
```

---

## Paso 7: Actualizar routes (products.routes.ts)

```typescript
import { Router } from "express";
import { ProductsController } from "./products.controller.js";
import { requireAuth } from "../../middlewares/authMiddleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  deleteProductSchema,
  getProductsQuerySchema,
} from "./products.schemas.js";

const router = Router();
const productsController = new ProductsController();

router.use(requireAuth);

router.get("/", validateRequest(getProductsQuerySchema), (req, res, next) =>
  productsController.getProducts(req, res, next),
);

router.get("/:id", validateRequest(getProductSchema), (req, res, next) =>
  productsController.getProductById(req, res, next),
);

router.post("/", validateRequest(createProductSchema), (req, res, next) =>
  productsController.createProduct(req, res, next),
);

router.put("/:id", validateRequest(updateProductSchema), (req, res, next) =>
  productsController.updateProduct(req, res, next),
);

router.delete("/:id", validateRequest(deleteProductSchema), (req, res, next) =>
  productsController.deleteProduct(req, res, next),
);

export default router;
```

---

## Paso 8: Registrar rutas en app.ts

Edita `src/app.ts` y añade:

```typescript
// Importar rutas (añadir al principio)
import productsRoutes from "./modules/products/products.routes.js";

// Registrar ruta (después de las otras rutas)
app.use("/api/products", productsRoutes);
```

---

## Paso 9: Probar en Insomnia

1. Crear producto:

```
POST http://localhost:3500/api/products
Headers:
  Authorization: Bearer <tu_token>
Body:
{
  "name": "Laptop HP",
  "description": "Laptop de alta gama",
  "price": 899.99,
  "stock": 10
}
```

2. Listar productos:

```
GET http://localhost:3500/api/products
Headers:
  Authorization: Bearer <tu_token>
```

3. Obtener producto:

```
GET http://localhost:3500/api/products/:id
Headers:
  Authorization: Bearer <tu_token>
```

4. Actualizar producto:

```
PUT http://localhost:3500/api/products/:id
Headers:
  Authorization: Bearer <tu_token>
Body:
{
  "stock": 5
}
```

5. Eliminar producto:

```
DELETE http://localhost:3500/api/products/:id
Headers:
  Authorization: Bearer <tu_token>
```

---

## Paso 10: Usar desde React

```jsx
// src/api/products.js
import { fetchWithAuth } from "../utils/api";

export async function getProducts(page = 1, limit = 10, search = "") {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });
  return await fetchWithAuth(`/products?${query}`);
}

export async function getProduct(id) {
  return await fetchWithAuth(`/products/${id}`);
}

export async function createProduct(data) {
  return await fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id, data) {
  return await fetchWithAuth(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return await fetchWithAuth(`/products/${id}`, {
    method: "DELETE",
  });
}
```

---

## Checklist completo

- [ ] Añadir modelo en `prisma/schema.prisma`
- [ ] Añadir relación en modelo `User`
- [ ] Ejecutar migración (`prisma migrate dev`)
- [ ] Generar Prisma Client (`prisma generate`)
- [ ] Copiar carpeta `template-resource` con nuevo nombre
- [ ] Renombrar archivos (`template.*` → `<recurso>.*`)
- [ ] Actualizar `schemas.ts` con campos del recurso
- [ ] Actualizar `service.ts` (desactivar placeholders, usar `prisma.<recurso>`)
- [ ] Actualizar `controller.ts` (renombrar clases y métodos)
- [ ] Actualizar `routes.ts` (renombrar imports y clases)
- [ ] Registrar rutas en `src/app.ts`
- [ ] Reiniciar servidor
- [ ] Probar endpoints en Insomnia
- [ ] Crear funciones en React para consumir la API

---

## Siguiente paso

Ve a [05-troubleshooting.md](./05-troubleshooting.md) si tienes problemas.

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
