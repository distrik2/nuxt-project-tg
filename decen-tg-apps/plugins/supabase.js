// plugins/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dqtjapmdflolvbanhnyu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdGphcG1kZmxvbHZiYW5obnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyODMxODksImV4cCI6MjA0NDg1OTE4OX0.8O8IgzAsmhg3aqhHSDHf-QiO218hF-V_A94AAh8t7yw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default defineNuxtPlugin(() => {
  return {
    provide: {
      supabase
    }
  }
})