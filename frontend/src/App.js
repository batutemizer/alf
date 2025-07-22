import React, { useState } from 'react';
import AttendancePage from './pages/AttendancePage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import GenerateQR from './pages/GenerateQR';
import AddStudent from './pages/AddStudent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SchoolIcon from '@mui/icons-material/School';

function App() {
  const [admin, setAdmin] = useState(false);
  const [page, setPage] = useState('attendance');

  if (admin) {
    return <AdminPanel />;
  }

  return (
    <div>
      <AppBar position="static" color="default" elevation={2} sx={{ mb: 4 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton color={page === 'attendance' ? 'primary' : 'default'} onClick={() => setPage('attendance')}>
            <HowToRegIcon />
          </IconButton>
          <Button color={page === 'attendance' ? 'primary' : 'inherit'} onClick={() => setPage('attendance')} sx={{ fontWeight: 600 }}>Yoklama</Button>
          <IconButton color={page === 'admin' ? 'primary' : 'default'} onClick={() => setPage('admin')}>
            <AdminPanelSettingsIcon />
          </IconButton>
          <Button color={page === 'admin' ? 'primary' : 'inherit'} onClick={() => setPage('admin')} sx={{ fontWeight: 600 }}>Yönetici</Button>
          <IconButton color={page === 'qr' ? 'primary' : 'default'} onClick={() => setPage('qr')}>
            <QrCodeIcon />
          </IconButton>
          <Button color={page === 'qr' ? 'primary' : 'inherit'} onClick={() => setPage('qr')} sx={{ fontWeight: 600 }}>QR Kod</Button>
        </Toolbar>
      </AppBar>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {page === 'attendance' && <AttendancePage />}
        {page === 'admin' && <AdminLogin onLogin={() => setAdmin(true)} />}
        {page === 'qr' && <GenerateQR />}
      </div>
      <footer style={{ textAlign: 'center', color: '#888', marginTop: 48, marginBottom: 16, fontSize: 14 }}>
        <SchoolIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} /> ALF Kurs Merkezi Yoklama Sistemi
      </footer>
    </div>
  );
}

export default App;
