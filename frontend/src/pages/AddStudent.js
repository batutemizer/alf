import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, Fade, Avatar } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

const AddStudent = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);
    try {
      const res = await axios.post('https://alf-uenk.onrender.com/api/student/add', {
        name,
        surname,
        parent_phone: parentPhone,
        device_id: getDeviceId(),
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
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
                <PersonAddIcon sx={{ fontSize: 38 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: 1 }}>
                Öğrenci Ekle
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#e0f7fa', mb: 2, textAlign: 'center' }}>
                Yeni bir öğrenci kaydı oluşturun.<br />
                <span style={{ fontSize: 13, color: '#b2ebf2' }}>Her cihazdan sadece bir öğrenci kaydı yapılabilir.</span>
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
                label="Veli Telefon"
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                required
                fullWidth
                variant="filled"
                sx={{ mb: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}
                InputProps={{ style: { color: '#1a237e', fontWeight: 600 } }}
              />
              <Box sx={{ mb: 2, color: '#b2ebf2', fontSize: 13, textAlign: 'center' }}>
                Cihaz ID: <b>{getDeviceId()}</b>
              </Box>
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
                {loading ? 'Ekleniyor...' : 'Öğrenci Ekle'}
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

export default AddStudent; 