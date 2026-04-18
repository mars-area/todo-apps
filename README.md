# Working Time
07.08 PM 15 April 2026 - 01.30 AM 16 April 2026

# To run the project

1. setup `.env` file in `/apps/api`

```text
DB_SERVER=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=<your_database_user>
DB_PASS=<your_database_password>
```
2. create database with name `todo_db` using pgAdmin, adminer, or other tools

3. run the development workflow

```bash
# Install dependencies in root directory
npm install

# run migrations & seeders in api directory
cd apps/api
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# run the project in root directory
npm run dev
```

4. Login dengan email `user@test.com` dan password `password`. Atau register dengan email dan password sendiri.

# Deployment
will be updated soon

# Asumsi yang digunakan
- Aplikasi todo sederhana yang diakses oleh banyak user
- User dapat login dan register
- User dapat melihat, membuat, mengedit, dan menghapus task milik mereka sendiri

# Keputusan Teknis
- Menggunakan monorepo untuk mengelola frontend dan backend
- Menggunakan Shadcn UI sebagai UI framework untuk frontend
- Menggunakan tsx untuk running local development karena lebih cepat dan mudah untuk debugging
- Menambahkan index pada tabel tasks untuk mempercepat pencarian task berdasarkan `userId`, `dueDate`, `priority`, dan `status`
- Menambahkan pagination pada API `get tasks` untuk melimitasi jumlah task yang diambil