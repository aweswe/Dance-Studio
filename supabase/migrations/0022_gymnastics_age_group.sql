-- Migration: 0022_gymnastics_age_group.sql
-- Fix Gymnastics age group display to '5+' on enrollment and class schedules

UPDATE programmes
SET age_group = '5+'
WHERE slug IN ('gymnastics', 'gymnastic') OR age_group = '5';
