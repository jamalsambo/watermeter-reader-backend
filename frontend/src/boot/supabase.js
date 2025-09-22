import { createClient } from '@supabase/supabase-js'
// import { useComposablesStores } from "src/composables";


const supabaseUrl = 'https://zcrdvyfthzdhruqqiism.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcmR2eWZ0aHpkaHJ1cXFpaXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzU5MDMsImV4cCI6MjA1ODE1MTkwM30.9zqEyi1tWP7UUyjHFNEMALSys8bJ-5bP5FDgjnV3luE'
const supabase = createClient(supabaseUrl, supabaseKey)

// supabase.auth.onAuthStateChange((event, session) => {
//   const composableStores = useComposablesStores();
//   composableStores.userSupabase = session?.user || null;
// })

export default function useSupabase () {
  return { supabase }
}
