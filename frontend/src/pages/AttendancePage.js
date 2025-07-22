import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, MenuItem, Button, Box, Fade, Avatar } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const getDeviceId = () => {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = Math.random().toString(36).substr(2, 12) + Date.now();
    localStorage.setItem('device_id', id);
  }
  return id;
};

const AttendancePage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [timeSlot, setTimeSlot] = useState('sabah');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);
    try {
      const res = await axios.post('https://alf-uenk.onrender.com/api/attendance/take', {
        name,
        surname,
        device_id: getDeviceId(),
        time_slot: timeSlot,
      });
      setMessage(res.data.message);
      setSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Bir hata oluştu.');
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <Fade in timeout={700}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <Card sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 5,
          boxShadow: 8,
          background: 'linear-gradient(135deg, #1a237e 60%, #00bfae 100%)',
          color: '#fff',
          p: 2
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#fff', color: '#1a237e', width: 64, height: 64, mb: 1, boxShadow: 2 }}>
                <HowToRegIcon sx={{ fontSize: 38 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 1 }}>
                Yoklama Al
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#e0f7fa', mb: 2, textAlign: 'center' }}>
                Kapıdaki QR kodu okutup bu formu doldurarak yoklamanızı alın.<br />
                <span style={{ fontSize: 13, color: '#b2ebf2' }}>Cihazınız bu yoklamaya özel olarak tanımlanır.</span>
              </Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
              <TextField
                label="İsim"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                fullWidth
                variant="filled"
                sx={{ mb: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}
                InputProps={{ style: { color: '#1a237e', fontWeight: 600 } }}
              />
              <TextField
                label="Soyisim"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                required
                fullWidth
                variant="filled"
                sx={{ mb: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}
                InputProps={{ style: { color: '#1a237e', fontWeight: 600 } }}
              />
              <TextField
                select
                label="Zaman Dilimi"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                fullWidth
                variant="filled"
                sx={{ mb: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}
                InputProps={{ style: { color: '#1a237e', fontWeight: 600 } }}
              >
                <MenuItem value="sabah">Sabah</MenuItem>
                <MenuItem value="oglen">Öğlen</MenuItem>
                <MenuItem value="aksam">Akşam</MenuItem>
              </TextField>
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 18,
                  background: 'linear-gradient(90deg, #00bfae 0%, #1a237e 100%)',
                  boxShadow: 4,
                  borderRadius: 3,
                  transition: '0.2s',
                  '&:hover': { background: 'linear-gradient(90deg, #1a237e 0%, #00bfae 100%)' }
                }}
                disabled={loading}
                endIcon={success ? <CheckCircleOutlineIcon /> : null}
              >
                {loading ? 'Gönderiliyor...' : 'Yoklama Al'}
              </Button>
            </form>
            {message && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                {success ? (
                  <Typography variant="h6" sx={{ color: '#00e676', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 28 }} /> {message}
                  </Typography>
                ) : (
                  <Typography variant="h6" sx={{ color: '#ffeb3b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <ErrorOutlineIcon sx={{ fontSize: 28 }} /> {message}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default AttendancePage; 