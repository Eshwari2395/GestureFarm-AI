import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Service
 * Database operations and authentication
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== Authentication ====================

export const authService = {
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user;
  },
};

// ==================== Soil Tests ====================

export const soilTestService = {
  async create(userId: string, testData: any) {
    const { data, error } = await supabase.from('soil_tests').insert([
      {
        user_id: userId,
        ...testData,
        test_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('soil_tests')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getLatest(userId: string) {
    const { data, error } = await supabase
      .from('soil_tests')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('soil_tests')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('soil_tests').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== Fertilizer Applications ====================

export const fertilizerService = {
  async create(userId: string, appData: any) {
    const { data, error } = await supabase.from('fertilizer_applications').insert([
      {
        user_id: userId,
        ...appData,
        application_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('fertilizer_applications')
      .select('*')
      .eq('user_id', userId)
      .order('application_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByCrop(userId: string, cropType: string) {
    const { data, error } = await supabase
      .from('fertilizer_applications')
      .select('*')
      .eq('user_id', userId)
      .eq('crop_type', cropType)
      .order('application_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from('fertilizer_applications').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== Irrigation Schedules ====================

export const irrigationService = {
  async create(userId: string, scheduleData: any) {
    const { data, error } = await supabase.from('irrigation_schedules').insert([
      {
        user_id: userId,
        ...scheduleData,
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getByUserAndCrop(userId: string, cropType: string) {
    const { data, error } = await supabase
      .from('irrigation_schedules')
      .select('*')
      .eq('user_id', userId)
      .eq('crop_type', cropType)
      .order('irrigation_sequence', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getUpcoming(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('irrigation_schedules')
      .select('*')
      .eq('user_id', userId)
      .gte('schedule_date', today)
      .order('schedule_date', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// ==================== Disease Detections ====================

export const diseaseService = {
  async create(userId: string, detectionData: any) {
    const { data, error } = await supabase.from('disease_detections').insert([
      {
        user_id: userId,
        ...detectionData,
        detection_date: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('disease_detections')
      .select('*')
      .eq('user_id', userId)
      .order('detection_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getUrgent(userId: string) {
    const { data, error } = await supabase
      .from('disease_detections')
      .select('*')
      .eq('user_id', userId)
      .in('urgency', ['high', 'critical'])
      .order('detection_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateTreatmentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('disease_detections')
      .update({ status, follow_up_date: new Date() })
      .eq('id', id);
    if (error) throw error;
    return data;
  },
};

// ==================== Loan Applications ====================

export const loanService = {
  async create(userId: string, loanData: any) {
    const { data, error } = await supabase.from('loan_applications').insert([
      {
        user_id: userId,
        ...loanData,
        submission_date: new Date(),
        status: 'draft',
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('user_id', userId)
      .order('submission_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getByStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('user_id', userId)
      .eq('status', status);
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, updates?: any) {
    const { data, error } = await supabase
      .from('loan_applications')
      .update({ status, ...updates })
      .eq('id', id);
    if (error) throw error;
    return data;
  },
};

// ==================== IoT Sensors ====================

export const sensorService = {
  async createSensor(userId: string, sensorData: any) {
    const { data, error } = await supabase.from('iot_sensors').insert([
      {
        user_id: userId,
        ...sensorData,
        active: true,
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getUserSensors(userId: string) {
    const { data, error } = await supabase
      .from('iot_sensors')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);
    if (error) throw error;
    return data;
  },

  async addReading(sensorId: string, reading: any) {
    const { data, error } = await supabase.from('sensor_readings').insert([
      {
        sensor_id: sensorId,
        ...reading,
        timestamp: new Date(),
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getReadings(sensorId: string, hours = 24) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('sensor_id', sensorId)
      .gte('timestamp', from)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  },

  async deleteSensor(sensorId: string) {
    const { error } = await supabase
      .from('iot_sensors')
      .update({ active: false })
      .eq('id', sensorId);
    if (error) throw error;
  },

  async getAlerts(sensorId: string) {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('sensor_id', sensorId)
      .eq('alert_triggered', true)
      .order('timestamp', { ascending: false })
      .limit(10);
    if (error) throw error;
    return data;
  },
};

// ==================== Analytics ====================

export const analyticsService = {
  async getUserMetrics(userId: string) {
    const { data, error } = await supabase
      .from('user_farm_metrics')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getSoilHealthTrends(userId: string) {
    const { data, error } = await supabase
      .from('soil_health_trends')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getStateAverages(state: string) {
    const { data, error } = await supabase
      .from('user_farm_metrics')
      .select('avg_soil_health')
      .eq('state', state);
    if (error) throw error;
    return data;
  },
};

// ==================== Community ====================

export const communityService = {
  async createPost(userId: string, postData: any) {
    const { data, error } = await supabase.from('forum_posts').insert([
      {
        user_id: userId,
        ...postData,
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getPosts(category?: string) {
    let query = supabase.from('forum_posts').select('*');
    if (category) query = query.eq('category', category);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addComment(postId: string, userId: string, content: string) {
    const { data, error } = await supabase.from('forum_comments').insert([
      {
        post_id: postId,
        user_id: userId,
        content,
      },
    ]);
    if (error) throw error;
    return data;
  },

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export default {
  supabase,
  authService,
  soilTestService,
  fertilizerService,
  irrigationService,
  diseaseService,
  loanService,
  sensorService,
  analyticsService,
  communityService,
};
