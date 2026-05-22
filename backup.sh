#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.sql"
DATABASE_URL="postgresql://postgres:rSioABJPiiejyzfNCAPGPLLGkEuSWgIZ@viaduct.proxy.rlwy.net:42266/railway"

echo "Iniciando backup: $FILENAME"
pg_dump "$DATABASE_URL" > "$HOME/backups_ionfinance/$FILENAME"
echo "Backup concluído: $HOME/backups_ionfinance/$FILENAME"

# Apaga backups com mais de 7 dias
find "$HOME/backups_ionfinance" -name "backup_*.sql" -mtime +31 -delete
echo "Backups antigos removidos."
