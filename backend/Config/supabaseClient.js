const{ createclient, createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kzvtniajqclodwlokxww.supabase.co'

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dnRuaWFqcWNsb2R3bG9reHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTQyODUsImV4cCI6MjA1Nzk3MDI4NX0.Q2jWPiZFE371GJaKsPb92yFpLSshiT4laz3wT6gfr4M"

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;


