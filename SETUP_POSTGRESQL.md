# Setup PostgreSQL + pgvector di Laragon

## Step 1: Install PostgreSQL di Laragon

1. **Download PostgreSQL Portable**
   - Buka: https://www.enterprisedb.com/download-postgresql-binaries
   - Download versi Windows x86-64 (pilih versi 15 atau 16)
   - Extract file zip

2. **Copy ke Laragon**
   ```
   Extract hasil download → Copy folder "pgsql" 
   Paste ke: C:\laragon\bin\postgresql\
   Rename jadi: C:\laragon\bin\postgresql\postgresql-15
   ```

3. **Restart Laragon**
   - Klik kanan icon Laragon → Exit
   - Buka lagi Laragon
   - PostgreSQL akan muncul di menu

4. **Start PostgreSQL**
   - Klik "Start All" di Laragon
   - PostgreSQL akan running di port 5432

## Step 2: Setup PostgreSQL Database

1. **Buka pgAdmin atau Command Line**
   
   Lewat PowerShell:
   ```powershell
   # Masuk ke folder PostgreSQL
   cd C:\laragon\bin\postgresql\postgresql-15\bin
   
   # Login ke PostgreSQL (default user: postgres, password: kosong)
   .\psql.exe -U postgres
   ```

2. **Buat Database**
   ```sql
   CREATE DATABASE resto_db;
   ```

3. **Buat User (opsional)**
   ```sql
   CREATE USER resto_user WITH PASSWORD 'password123';
   GRANT ALL PRIVILEGES ON DATABASE resto_db TO resto_user;
   ```

4. **Connect ke database**
   ```sql
   \c resto_db
   ```

## Step 3: Install pgvector Extension

1. **Download pgvector**
   - Buka: https://github.com/pgvector/pgvector/releases
   - Download file: `pgvector-0.5.1-windows-x64-postgresql-15.zip`
   - Extract file

2. **Copy file pgvector**
   ```
   Dari extract pgvector, copy:
   - vector.dll → C:\laragon\bin\postgresql\postgresql-15\lib\
   - vector.control → C:\laragon\bin\postgresql\postgresql-15\share\extension\
   - vector--*.sql → C:\laragon\bin\postgresql\postgresql-15\share\extension\
   ```

3. **Enable Extension di Database**
   
   Di psql:
   ```sql
   \c resto_db
   CREATE EXTENSION vector;
   ```

4. **Test Extension**
   ```sql
   -- Test create table dengan vector
   CREATE TABLE test_vector (
       id SERIAL PRIMARY KEY,
       embedding VECTOR(384)
   );
   
   -- Test insert
   INSERT INTO test_vector (embedding) 
   VALUES ('[1,2,3,4,5]');
   
   -- Kalau berhasil, berarti pgvector sudah jalan!
   
   -- Hapus test table
   DROP TABLE test_vector;
   ```

## Step 4: Update Laravel Configuration

1. **Install PostgreSQL Driver untuk Laravel**
   ```powershell
   composer require
   ```
   
   Pastikan extension PostgreSQL aktif di PHP:
   - Buka: C:\laragon\bin\php\php-8.x\php.ini
   - Cari dan uncomment: `extension=pdo_pgsql`
   - Cari dan uncomment: `extension=pgsql`
   - Restart Laragon

2. **Update .env**
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=resto_db
   DB_USERNAME=postgres
   DB_PASSWORD=
   ```

3. **Test Connection**
   ```powershell
   php artisan migrate:status
   ```

## Step 5: Add Vector Column ke Table Menus

1. **Buat Migration untuk Vector**
   ```powershell
   php artisan make:migration add_embedding_to_menus_table
   ```

2. **Edit Migration** (akan saya buatkan di step berikutnya)

## Troubleshooting

### PostgreSQL tidak muncul di Laragon
- Pastikan folder ada di: C:\laragon\bin\postgresql\postgresql-15
- Restart Laragon as Administrator

### Error "psql: error: connection to server failed"
- Cek PostgreSQL service running di Laragon
- Cek port 5432 tidak dipakai aplikasi lain

### Error "could not load library vector.dll"
- Pastikan vector.dll ada di folder lib
- Pastikan versi pgvector sesuai dengan PostgreSQL version

### Extension pgvector tidak bisa create
- Pastikan semua file pgvector sudah di copy
- Restart PostgreSQL service di Laragon
- Login sebagai superuser (postgres)

## Next Steps

Setelah setup selesai:
1. Migrate database
2. Add embedding column
3. Generate embeddings untuk menu
4. Test vector search
