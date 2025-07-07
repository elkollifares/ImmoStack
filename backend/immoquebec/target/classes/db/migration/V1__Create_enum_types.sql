-- Créez les types ENUM nécessaires

-- Créez le type ENUM UserRole
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
CREATE TYPE UserRole AS ENUM ('ADMIN', 'COMMON_USER');
END IF;
END $$;

-- Créez le type ENUM AdType
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adtype') THEN
CREATE TYPE AdType AS ENUM ('SALE', 'RENT');
END IF;
END $$;