# Working Time
start 19.08
end

# To run the project

1. setup `.env` file in `/apps/api`

```text
DB_SERVER=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=<your_database_user>
DB_PASS=<your_database_password>
```
2. create database using pgAdmin or other tools

3. run the development workflow

```bash
# Install dependencies
npm install

# run migrations & seeders
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# run the project
npm run dev

# deployment
# will be updated soon
```
# Asumsi yang digunakan
- Aplikasi todo sederhana yang diakses oleh banyak user
- User dapat login dan register
- User dapat melihat, membuat, mengedit, dan menghapus task milik mereka sendiri

# Keputusan Teknis
- Menggunakan monorepo untuk mengelola frontend dan backend
- Menggunakan tsx untuk running local development karena lebih cepat dan mudah untuk debugging


