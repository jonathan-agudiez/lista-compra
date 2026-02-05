
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gilkqqavnomidrspecwa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpbGtxcWF2bm9taWRyc3BlY3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODg2NTIsImV4cCI6MjA4NDA2NDY1Mn0.phtigmv-id9R67zlbN260hVdY3VQ2kbohQHrvGPp5wQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
