import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, Fade, Grid, Chip, Divider, Avatar, Paper } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AddStudent from './AddStudent';

const today = () => new Date().toISOString().slice(0, 10);

const AdminPanel = () => {
  const [timeSlot, setTimeSlot] = useState('sabah');
  const [attendees, setAttendees] = useState([]);
  const [nonAttendees, setNonAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [att, nonAtt] = await Promise.all([
        axios.get('https://alf-uenk.onrender.com/api/attendance/list', { params: { date: today(), time_slot: timeSlot } }),
        axios.get('https://alf-uenk.onrender.com/api/attendance/nonattendees', { params: { date: today(), time_slot: timeSlot } })
      ]);
      setAttendees(att.data.data || []);
      setNonAttendees(nonAtt.data.data || []);
    } catch (err) {
      setAttendees([]);
      setNonAttendees([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [timeSlot]);

  return (
    <Fade in timeout={700}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '70vh' }}>
        <Card sx={{ maxWidth: 700, width: '100%', borderRadius: 5, boxShadow: 8, background: 'linear-gradient(135deg, #1a237e 60%, #00bfae 100%)', color: '#fff', p: 2, mb: 4 }}>
          <CardContent>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 1, textAlign: 'center' }}>
              Yönetici Paneli
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#e0f7fa', mb: 2, textAlign: 'center' }}>
              Katılım sağlayan ve sağlamayan öğrencileri anlık olarak görüntüleyin.<br />
              <span style={{ fontSize: 13, color: '#b2ebf2' }}>Zaman dilimi seçerek yoklama durumunu görebilirsiniz.</span>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Chip label="Sabah" color={timeSlot === 'sabah' ? 'success' : 'default'} onClick={() => setTimeSlot('sabah')} sx={{ fontWeight: 700, fontSize: 16 }} />
              <Chip label="Öğlen" color={timeSlot === 'oglen' ? 'info' : 'default'} onClick={() => setTimeSlot('oglen')} sx={{ fontWeight: 700, fontSize: 16 }} />
              <Chip label="Akşam" color={timeSlot === 'aksam' ? 'primary' : 'default'} onClick={() => setTimeSlot('aksam')} sx={{ fontWeight: 700, fontSize: 16 }} />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#00bfae', mr: 1 }}><GroupIcon /></Avatar>
                    <Typography variant="h6" color="#1a237e" fontWeight={700}>Katılım Sağlayanlar</Typography>
                  </Box>
                  {loading ? 'Yükleniyor...' : (
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {attendees.map(a => (
                        <li key={a.id} style={{ color: '#1a237e', fontWeight: 600, marginBottom: 4 }}>{a.name} {a.surname}</li>
                      ))}
                    </ul>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#e53935', mr: 1 }}><PersonOffIcon /></Avatar>
                    <Typography variant="h6" color="#1a237e" fontWeight={700}>Katılım Sağlamayanlar</Typography>
                  </Box>
                  {loading ? 'Yükleniyor...' : (
                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                      {nonAttendees.map(s => (
                        <li key={s.id} style={{ color: '#1a237e', fontWeight: 600, marginBottom: 4 }}>{s.name} {s.surname} ({s.parent_phone})</li>
                      ))}
                    </ul>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <AddStudent />
      </Box>
    </Fade>
  );
};

export default AdminPanel; 