import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, Typography, Box, Fade, Avatar, Button } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';

const qrUrl = 'http://192.168.2.179:3000'; // Kapıdaki QR kodun yönlendireceği adres

const GenerateQR = () => {
  const [qr, setQr] = useState('');

  useEffect(() => {
    QRCode.toDataURL(qrUrl)
      .then(setQr)
      .catch(() => setQr(''));
  }, []);

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
                <QrCodeIcon sx={{ fontSize: 38 }} />
              </Avatar>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: 1 }}>
                Kapı için QR Kod
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#e0f7fa', mb: 2, textAlign: 'center' }}>
                Öğrenciler bu QR kodu okutarak yoklama sayfasına ulaşacak.<br />
                <span style={{ fontSize: 13, color: '#b2ebf2' }}>Yönlendirme adresi: <b>{qrUrl}</b></span>
              </Typography>
            </Box>
            {qr && <img src={qr} alt="QR Kod" style={{ width: 256, height: 256, borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(26,35,126,0.18)' }} />}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                href={qr}
                download="yoklama-qr.png"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(90deg, #00bfae 0%, #1a237e 100%)',
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 3,
                  boxShadow: 4,
                  mt: 1,
                  '&:hover': { background: 'linear-gradient(90deg, #1a237e 0%, #00bfae 100%)' }
                }}
              >
                QR Kodunu İndir
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default GenerateQR; 