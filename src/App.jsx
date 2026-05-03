import React, { useState, useEffect } from 'react';
import {
  Wallet, TrendingDown, Plane, Car, Home, Smartphone,
  Zap, Wifi, Utensils, Scissors, Heart, Gift,
  Target, DollarSign, Calendar, LayoutDashboard, CheckSquare, Square,
  Trophy, Flame, Sparkles, Shield, RefreshCw, PlusCircle, AlertCircle,
  Edit3, ArrowRight, History, Download, PiggyBank, Briefcase, CreditCard,
  PieChart as PieChartIcon, Activity, Clock, X, Check, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

// --- Default Data ---
const DEFAULT_INCOMES = [
  { id: 1, name: 'Walmart (Neto post-ahorro)', amount: 2460, icon: 'Wallet', dueDay: 15 },
  { id: 2, name: 'Ingreso Extra Fijo', amount: 640, icon: 'DollarSign', dueDay: 1 },
  { id: 3, name: 'Uber (Fines de semana)', amount: 1120, icon: 'Car', dueDay: 28 },
];

const DEFAULT_EXPENSES = [
  { id: 1, name: 'Casa', amount: 800, icon: 'Home', dueDay: 1 },
  { id: 2, name: 'Pago Carro', amount: 550, icon: 'Car', dueDay: 15 },
  { id: 3, name: 'Seguro Carro', amount: 220, icon: 'Car', dueDay: 18 },
  { id: 4, name: 'Diezmo', amount: 260, icon: 'Heart', dueDay: 15 },
  { id: 5, name: 'Gasolina', amount: 200, icon: 'Zap', dueDay: 1 },
  { id: 6, name: 'Luz', amount: 90, icon: 'Zap', dueDay: 10 },
  { id: 7, name: 'Internet', amount: 70, icon: 'Wifi', dueDay: 5 },
  { id: 8, name: 'Teléfono', amount: 60, icon: 'Smartphone', dueDay: 12 },
  { id: 9, name: 'Suscripciones (Hosting, IA)', amount: 60, icon: 'Wifi', dueDay: 2 },
  { id: 10, name: 'Comida ($75 quincenal)', amount: 150, icon: 'Utensils', dueDay: 15 },
  { id: 11, name: 'Para Sheila', amount: 280, icon: 'Gift', dueDay: 15 },
  { id: 12, name: 'Recortes', amount: 90, icon: 'Scissors', dueDay: 15 },
  { id: 13, name: 'Gustos Personales', amount: 80, icon: 'Wallet', dueDay: 1 },
  { id: 14, name: 'Mínimo Préstamo Personal', amount: 165, icon: 'TrendingDown', dueDay: 5 },
  { id: 15, name: 'Mínimo Préstamo Estudiantil', amount: 135, icon: 'TrendingDown', dueDay: 28 },
  { id: 16, name: 'Fondo de Emergencia', amount: 200, icon: 'Shield', dueDay: 1 },
];

const DEFAULT_Q1 = [
  { id: 'q1-1', type: 'income', text: 'Cobro Walmart + Extra + Uber', amount: 2110, done: false },
  { id: 'q1-2', type: 'fixed', text: 'Pagar Casa', amount: 800, done: false },
  { id: 'q1-3', type: 'fixed', text: 'Separar Diezmo', amount: 130, done: false },
  { id: 'q1-4', type: 'fixed', text: 'Pagar Luz', amount: 90, done: false },
  { id: 'q1-5', type: 'fixed', text: 'Pagar Internet', amount: 70, done: false },
  { id: 'q1-12', type: 'debt-min', debtId: 'personal', text: 'Pago Mínimo Préstamo Personal', amount: 165, done: false },
  { id: 'q1-14', type: 'debt-min', debtId: 'tarjeta', text: 'Pago Normal Tarjeta', amount: 150, done: false },
  { id: 'q1-6', type: 'variable', text: 'Enviar a Sheila (Mitad)', amount: 140, done: false, adelanto: 0 },
  { id: 'q1-7', type: 'variable', text: 'Separar Comida', amount: 75, done: false, adelanto: 0 },
  { id: 'q1-8', type: 'variable', text: 'Separar Gasolina', amount: 100, done: false, adelanto: 0 },
  { id: 'q1-9', type: 'variable', text: 'Separar Recorte y Gustos', amount: 85, done: false, adelanto: 0 },
  { id: 'q1-10', type: 'savings', text: 'Guardar para Viaje RD', amount: 80, done: false },
  { id: 'q1-13', type: 'savings', text: 'Fondo de Emergencia', amount: 100, done: false },
  { id: 'q1-11', type: 'snowball', text: 'Abonar EXCEDENTE a', amount: 125, done: false, isDynamic: true },
];

const DEFAULT_Q2 = [
  { id: 'q2-1', type: 'income', text: 'Cobro Walmart + Extra + Uber', amount: 2110, done: false },
  { id: 'q2-2', type: 'fixed', text: 'Pagar Carro', amount: 550, done: false },
  { id: 'q2-3', type: 'fixed', text: 'Pagar Seguro del Carro', amount: 220, done: false },
  { id: 'q2-4', type: 'fixed', text: 'Separar Diezmo', amount: 130, done: false },
  { id: 'q2-5', type: 'fixed', text: 'Pagar Teléfono', amount: 60, done: false },
  { id: 'q2-6', type: 'fixed', text: 'Pagar Suscripciones', amount: 60, done: false },
  { id: 'q2-13', type: 'debt-min', debtId: 'estudiantil', text: 'Pago Mínimo Estudiantil', amount: 135, done: false },
  { id: 'q2-15', type: 'debt-min', debtId: 'tarjeta', text: 'Pago Normal Tarjeta', amount: 150, done: false },
  { id: 'q2-7', type: 'variable', text: 'Enviar a Sheila (Mitad)', amount: 140, done: false, adelanto: 0 },
  { id: 'q2-8', type: 'variable', text: 'Separar Comida', amount: 75, done: false, adelanto: 0 },
  { id: 'q2-9', type: 'variable', text: 'Separar Gasolina', amount: 100, done: false, adelanto: 0 },
  { id: 'q2-10', type: 'variable', text: 'Separar Recorte y Gustos', amount: 85, done: false, adelanto: 0 },
  { id: 'q2-11', type: 'savings', text: 'Guardar para Viaje RD', amount: 80, done: false },
  { id: 'q2-14', type: 'savings', text: 'Fondo de Emergencia', amount: 100, done: false },
  { id: 'q2-12', type: 'snowball', text: 'Abonar EXCEDENTE a', amount: 225, done: false, isDynamic: true },
];

const DEFAULT_DEBTS = [
  { id: 'tarjeta', name: 'Tarjeta', balance: 2500, initial: 2500, apr: 24, dueDay: 15 },
  { id: 'personal', name: 'Préstamo Personal', balance: 3120, initial: 3120, apr: 12, dueDay: 5 },
  { id: 'estudiantil', name: 'Préstamo Estudiantil', balance: 11800, initial: 11800, apr: 6, dueDay: 28 },
];

const DEFAULT_WALLETS = [
  { id: 'cheques', name: 'Cuenta Cheques', balance: 1200, icon: 'Briefcase' },
  { id: 'ahorros', name: 'Ahorros', balance: 800, icon: 'PiggyBank' },
  { id: 'efectivo', name: 'Efectivo', balance: 150, icon: 'Wallet' },
];

// --- Helper Functions for Local Storage ---
const loadData = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return defaultData;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('contable');

  // State initialized from local storage
  const [racha, setRacha] = useState(() => loadData('meta2026_racha', 0));
  const [q1Tasks, setQ1Tasks] = useState(() => {
    const data = loadData('meta2026_q1_v2', DEFAULT_Q1);
    return data.map(t => t.id === 'q1-11' && t.amount === 275 ? { ...t, amount: 125 } : t);
  });
  const [q2Tasks, setQ2Tasks] = useState(() => {
    const data = loadData('meta2026_q2_v2', DEFAULT_Q2);
    return data.map(t => t.id === 'q2-12' && t.amount === 375 ? { ...t, amount: 225 } : t);
  });

  const [incomes, setIncomes] = useState(() => loadData('meta2026_incomes', DEFAULT_INCOMES));
  const [expenses, setExpenses] = useState(() => loadData('meta2026_expenses', DEFAULT_EXPENSES));
  const [debts, setDebts] = useState(() => loadData('meta2026_debts_v2', DEFAULT_DEBTS));

  // Side Hustle Tracker State
  const [sideHustles, setSideHustles] = useState(() => loadData('meta2026_sideHustles', []));
  const [newHustleDesc, setNewHustleDesc] = useState('');
  const [newHustleAmount, setNewHustleAmount] = useState('');

  // Achievements
  const [achievements, setAchievements] = useState(() => loadData('meta2026_achievements', {
    firstQPerfect: false,
    debtDestroyer: false,
    saverMonth: false,
    streak3Months: false
  }));

  // Nuevos estados para V3
  const [history, setHistory] = useState(() => loadData('meta2026_history', []));
  const [wallets, setWallets] = useState(() => loadData('meta2026_wallets', DEFAULT_WALLETS));
  const [whatIfExtra, setWhatIfExtra] = useState(0); // Para el simulador

  // --- Payment Tracking State ---
  const [paymentLogs, setPaymentLogs] = useState(() => loadData('meta2026_paymentLogs', []));
  const [showPayModal, setShowPayModal] = useState(null); // { quincena, taskId }
  const [payModalAmount, setPayModalAmount] = useState('');
  const [payModalFreq, setPayModalFreq] = useState('quincenal');
  const [whatIfInput, setWhatIfInput] = useState('');

  // --- Universal Edit Modal ---
  const [editModal, setEditModal] = useState(null);
  // { type, title, subtitle, value, onConfirm, inputType, placeholder, options }
  const [editModalValue, setEditModalValue] = useState('');

  // --- Edit Payment Log Modal ---
  const [editPayLog, setEditPayLog] = useState(null); // payment log object
  const [editPayLogAmount, setEditPayLogAmount] = useState('');

  const openEditModal = (config) => {
    setEditModal(config);
    setEditModalValue(String(config.value || ''));
  };

  const confirmEditModal = () => {
    if (editModal?.onConfirm) {
      editModal.onConfirm(editModalValue);
    }
    setEditModal(null);
  };

  // Payment log edit/delete
  const openEditPaymentLog = (log) => {
    setEditPayLog(log);
    setEditPayLogAmount(String(log.amount));
  };

  const confirmEditPaymentLog = () => {
    if (!editPayLog) return;
    const newAmount = parseFloat(editPayLogAmount) || 0;
    setPaymentLogs(prev => prev.map(l => l.id === editPayLog.id ? { ...l, amount: newAmount } : l));
    setEditPayLog(null);
  };

  const deletePaymentLog = (logId) => {
    setPaymentLogs(prev => prev.filter(l => l.id !== logId));
    setEditPayLog(null);
  };

  // Save to local storage whenever state changes
  useEffect(() => { localStorage.setItem('meta2026_racha', JSON.stringify(racha)); }, [racha]);
  useEffect(() => { localStorage.setItem('meta2026_q1_v2', JSON.stringify(q1Tasks)); }, [q1Tasks]);
  useEffect(() => { localStorage.setItem('meta2026_q2_v2', JSON.stringify(q2Tasks)); }, [q2Tasks]);
  useEffect(() => { localStorage.setItem('meta2026_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('meta2026_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('meta2026_debts_v2', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('meta2026_sideHustles', JSON.stringify(sideHustles)); }, [sideHustles]);
  useEffect(() => { localStorage.setItem('meta2026_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('meta2026_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('meta2026_wallets', JSON.stringify(wallets)); }, [wallets]);
  useEffect(() => { localStorage.setItem('meta2026_paymentLogs', JSON.stringify(paymentLogs)); }, [paymentLogs]);


  // ================= CALCS =================
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const activeDebt = debts.find(d => d.balance > 0) || debts[debts.length - 1]; // Fallback to last if all paid
  const totalDebtBalance = debts.reduce((acc, curr) => acc + curr.balance, 0);
  const deudaTotalInicial = debts.reduce((acc, curr) => acc + curr.initial, 0);

  const totalSideHustle = sideHustles.reduce((acc, curr) => acc + curr.amount, 0);

  const totalMinimosOtras = [...q1Tasks, ...q2Tasks].reduce((acc, t) => {
    if (t.type === 'debt-min' && t.debtId !== activeDebt.id) return acc + (t.amount - (t.adelanto || 0));
    return acc;
  }, 0);

  const poderAtaqueActiva = [...q1Tasks, ...q2Tasks].reduce((acc, t) => {
    if (t.type === 'snowball' || (t.type === 'debt-min' && t.debtId === activeDebt.id)) return acc + (t.amount - (t.adelanto || 0));
    return acc;
  }, totalSideHustle);

  const poderTotalDeudas = totalMinimosOtras + poderAtaqueActiva;

  const calculatePayoffDates = (baseDebts, extraSimulator = 0) => {
    let result = {};
    let tempDebts = baseDebts.map(d => ({ ...d }));
    let monthsElapsed = 0;

    while (tempDebts.some(d => d.balance > 0) && monthsElapsed < 240) {
      monthsElapsed++;
      // Simulamos los pagos en base a compromisos actuales
      let snowball = (monthsElapsed === 1) ? totalSideHustle : 0;
      snowball += extraSimulator; // Inyectar simulador

      [...q1Tasks, ...q2Tasks].forEach(t => { if (t.type === 'snowball') snowball += t.amount; });

      tempDebts.forEach(d => {
        if (d.balance > 0) {
          // Add Interest calculation (compound approximation per month)
          const interestMultiplier = d.apr ? (d.apr / 100 / 12) : 0;
          d.balance += d.balance * interestMultiplier;

          let minPayment = 0;
          [...q1Tasks, ...q2Tasks].forEach(t => { if (t.type === 'debt-min' && t.debtId === d.id) minPayment += t.amount; });

          if (minPayment > d.balance) {
            snowball += (minPayment - d.balance);
            d.balance = 0;
          } else {
            d.balance -= minPayment;
          }
        }
      });

      for (let i = 0; i < tempDebts.length; i++) {
        if (snowball <= 0) break;
        if (tempDebts[i].balance > 0) {
          if (snowball >= tempDebts[i].balance) {
            snowball -= tempDebts[i].balance;
            tempDebts[i].balance = 0;
          } else {
            tempDebts[i].balance -= snowball;
            snowball = 0;
          }
        }
      }

      tempDebts.forEach(d => {
        if (d.balance === 0 && !result[d.id]) {
          const dObj = new Date();
          dObj.setMonth(dObj.getMonth() + monthsElapsed);
          const mesNum = dObj.getMonth() + 1;
          const year = dObj.getFullYear();
          result[d.id] = `${mesNum < 10 ? '0' + mesNum : mesNum}/${year}`;
        }
      });
    }
    return result;
  };

  const payoffDatesMemo = React.useMemo(() => calculatePayoffDates(debts, 0), [debts, q1Tasks, q2Tasks, totalSideHustle]);
  const whatIfDatesMemo = React.useMemo(() => calculatePayoffDates(debts, whatIfExtra), [debts, q1Tasks, q2Tasks, totalSideHustle, whatIfExtra]);

  // Check achievements
  useEffect(() => {
    let changed = false;
    let newAchs = { ...achievements };

    const isQ1Done = q1Tasks.every(t => t.done);
    const isQ2Done = q2Tasks.every(t => t.done);

    if ((isQ1Done || isQ2Done) && !newAchs.firstQPerfect) {
      newAchs.firstQPerfect = true;
      changed = true;
    }

    if (totalSideHustle >= 500 && !newAchs.debtDestroyer) {
      newAchs.debtDestroyer = true;
      changed = true;
    }

    if (racha >= 6 && !newAchs.streak3Months) {
      newAchs.streak3Months = true; // 3 meses = 6 quincenas
      changed = true;
    }

    if (changed) setAchievements(newAchs);
  }, [q1Tasks, q2Tasks, totalSideHustle, achievements, racha]);


  // ================= ACTIONS =================
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f43f5e']
    });
  };

  // Helper: calcular próxima fecha según frecuencia
  const calcNextPayDate = (freq) => {
    const now = new Date();
    const next = new Date(now);
    if (freq === 'semanal') next.setDate(now.getDate() + 7);
    else if (freq === 'quincenal') next.setDate(now.getDate() + 15);
    else if (freq === 'mensual') next.setMonth(now.getMonth() + 1);
    return next;
  };

  const formatDateShort = (d) => {
    const date = new Date(d);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]}`;
  };

  // Obtener el último log para una tarea
  const getLastLog = (taskId) => {
    return paymentLogs.filter(l => l.taskId === taskId).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  };

  // Obtener cuántas veces se ha pagado esta tarea
  const getPayCount = (taskId) => paymentLogs.filter(l => l.taskId === taskId).length;

  const toggleTask = (quincena, id) => {
    const tasks = quincena === 1 ? q1Tasks : q2Tasks;
    const task = tasks.find(t => t.id === id);

    // Si ya está done, permitir desmarcar directamente
    if (task.done) {
      if (quincena === 1) {
        setQ1Tasks(q1Tasks.map(t => t.id === id ? { ...t, done: false } : t));
      } else {
        setQ2Tasks(q2Tasks.map(t => t.id === id ? { ...t, done: false } : t));
      }
      return;
    }

    // Abrir modal de pago para registrar
    const lastLog = getLastLog(id);
    setPayModalAmount(String(task.amount - (task.adelanto || 0)));
    setPayModalFreq(lastLog?.frequency || 'quincenal');
    setShowPayModal({ quincena, taskId: id });
  };

  const confirmPayment = () => {
    if (!showPayModal) return;
    const { quincena, taskId } = showPayModal;
    const actualAmount = parseFloat(payModalAmount) || 0;
    const nextDate = calcNextPayDate(payModalFreq);

    // Guardar log de pago
    const newLog = {
      id: Date.now(),
      taskId,
      date: new Date().toISOString(),
      amount: actualAmount,
      frequency: payModalFreq,
      nextPayDate: nextDate.toISOString()
    };
    setPaymentLogs(prev => [newLog, ...prev]);

    // Marcar como done y actualizar cantidad real si es diferente
    let newTasks;
    if (quincena === 1) {
      newTasks = q1Tasks.map(t => t.id === taskId ? { ...t, done: true, lastPaidAmount: actualAmount } : t);
      setQ1Tasks(newTasks);
    } else {
      newTasks = q2Tasks.map(t => t.id === taskId ? { ...t, done: true, lastPaidAmount: actualAmount } : t);
      setQ2Tasks(newTasks);
    }

    const allTasks = quincena === 1 ? newTasks : q1Tasks;
    const allTasks2 = quincena === 2 ? newTasks : q2Tasks;
    const isQ1Done = (quincena === 1 ? newTasks : q1Tasks).every(t => t.done);
    const isQ2Done = (quincena === 2 ? newTasks : q2Tasks).every(t => t.done);
    const wasQ1Done = q1Tasks.every(t => t.done);
    const wasQ2Done = q2Tasks.every(t => t.done);

    if ((isQ1Done && !wasQ1Done) || (isQ2Done && !wasQ2Done)) {
      triggerConfetti();
      setRacha(prev => prev + 1);
    }

    setShowPayModal(null);
  };

  const handleAdelanto = (e, quincena, id) => {
    e.stopPropagation();
    const tasks = quincena === 1 ? q1Tasks : q2Tasks;
    const task = tasks.find(t => t.id === id);
    const currentValue = task?.adelanto || 0;

    openEditModal({
      type: 'adelanto',
      title: 'Adelanto de Pago',
      subtitle: task?.text || 'Tarea',
      value: currentValue,
      inputType: 'number',
      placeholder: '0.00',
      onConfirm: (val) => {
        const parsed = parseFloat(val);
        if (!isNaN(parsed) && parsed >= 0) {
          if (quincena === 1) {
            setQ1Tasks(q1Tasks.map(t => t.id === id ? { ...t, adelanto: parsed } : t));
          } else {
            setQ2Tasks(q2Tasks.map(t => t.id === id ? { ...t, adelanto: parsed } : t));
          }
        }
      }
    });
  };

  // payoffDatesMemo takes care of forecasting now

  const cerrarMes = () => {
    if (!window.confirm("¿Seguro que quieres CERRAR EL MES? Esto aplicará los pagos realizados a tus deudas y reiniciará el check de tareas.")) return;

    let newDebts = [...debts];
    const allTasks = [...q1Tasks, ...q2Tasks];

    // Snapshot variables para el historial
    let principalPagado = 0;
    let interesPagado = 0;

    // 0. Aplicar interes compuesto
    newDebts = newDebts.map(d => {
      if (d.balance > 0) {
        const interesMonto = d.balance * ((d.apr || 0) / 100 / 12);
        interesPagado += interesMonto;
        return { ...d, balance: d.balance + interesMonto };
      }
      return d;
    });

    // 1. Aplicar pagos normales y mínimos
    allTasks.forEach(t => {
      if (t.done && t.type === 'debt-min' && t.debtId) {
        const dIndex = newDebts.findIndex(d => d.id === t.debtId);
        if (dIndex !== -1 && newDebts[dIndex].balance > 0) {
          const pagoEfectivo = (t.amount - (t.adelanto || 0));
          principalPagado += pagoEfectivo;
          newDebts[dIndex].balance = Math.max(0, newDebts[dIndex].balance - pagoEfectivo);
        }
      }
    });

    // 2. Calcular fondo Snowball (excedentes fijos + side hustles)
    let snowballMonto = totalSideHustle;
    allTasks.forEach(t => {
      if (t.done && t.type === 'snowball') {
        const pagoEfectivo = (t.amount - (t.adelanto || 0));
        snowballMonto += pagoEfectivo;
      }
    });

    // Añadir lo que sobró directo a registro principal pagado total (simplificado)
    principalPagado += snowballMonto;

    // 3. Aplicar bola de nieve en cascada
    for (let i = 0; i < newDebts.length; i++) {
      if (snowballMonto <= 0) break;
      if (newDebts[i].balance > 0) {
        if (snowballMonto >= newDebts[i].balance) {
          snowballMonto -= newDebts[i].balance;
          newDebts[i].balance = 0; // Saldada!
        } else {
          newDebts[i].balance -= snowballMonto;
          snowballMonto = 0;
        }
      }
    }

    // 4. Guardar Historial del mes
    const montoTotalResta = newDebts.reduce((acc, curr) => acc + curr.balance, 0);
    const snapshotObj = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      totalPagado: principalPagado,
      totalInteres: interesPagado,
      sideHustlesMonto: totalSideHustle,
      deudaRestante: montoTotalResta,
      detalleDeudas: newDebts.map(d => ({ nombre: d.name, balance: d.balance }))
    };
    setHistory([snapshotObj, ...history]);

    setDebts(newDebts);
    setQ1Tasks(q1Tasks.map(t => ({ ...t, done: false, adelanto: 0 })));
    setQ2Tasks(q2Tasks.map(t => ({ ...t, done: false, adelanto: 0 })));
    setSideHustles([]);

    triggerConfetti();
    alert("¡Mes cerrado exitosamente! El historial y las deudas han sido actualizadas.");
  };

  const addSideHustle = (e) => {
    e.preventDefault();
    if (!newHustleDesc || !newHustleAmount) return;

    setSideHustles([...sideHustles, {
      id: Date.now(),
      desc: newHustleDesc,
      amount: parseFloat(newHustleAmount),
      date: new Date().toLocaleDateString()
    }]);
    setNewHustleDesc('');
    setNewHustleAmount('');
    triggerConfetti();
  };

  const deleteSideHustle = (id) => {
    setSideHustles(sideHustles.filter(s => s.id !== id));
  }

  const updateDueDay = (type, id) => {
    let item;
    let list, setList;
    if (type === 'income') {
      item = incomes.find(i => i.id === id); list = incomes; setList = setIncomes;
    } else if (type === 'expense') {
      item = expenses.find(e => e.id === id); list = expenses; setList = setExpenses;
    } else if (type === 'debt') {
      item = debts.find(d => d.id === id); list = debts; setList = setDebts;
    }

    if (item) {
      openEditModal({
        type: 'dueDay',
        title: 'Fecha de Pago',
        subtitle: `${item.name} — Ej: 15, Viernes, Semanal`,
        value: item.dueDay || '',
        inputType: 'text',
        placeholder: 'Ej: 15, Viernes, Semanal',
        onConfirm: (val) => {
          setList(list.map(x => x.id === id ? { ...x, dueDay: val.trim() } : x));
        }
      });
    }
  };


  // ================= UI RENDERERS =================

  const getThemeClass = () => {
    if (racha >= 2 || totalSideHustle > 200) return 'bg-slate-950 selection:bg-emerald-500/30 ring-1 ring-inset ring-emerald-500/10';
    return 'bg-slate-950 selection:bg-indigo-500/30';
  }

  const renderChecklist = (tasks, quincena) => {
    const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
    const isCompleted = progress === 100;

    return (
      <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${isCompleted ? 'glass-card border-emerald-500/30 shadow-lg shadow-emerald-500/10' : 'glass-card'}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-500/20' : 'bg-indigo-500/20'}`}>
              <Calendar className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-indigo-400'}`} />
            </div>
            Quincena {quincena}
          </h3>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-500 text-white animate-pulseGlow' : progress > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
            {progress}% Listo
          </span>
        </div>

        <div className="w-full bg-slate-800/60 rounded-full h-1.5 mb-5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 animate-shimmer'}`} style={{ width: `${progress}%` }}></div>
        </div>

        <div className="space-y-2">
          {tasks.map(task => {
            const effectiveAmount = task.amount - (task.adelanto || 0);
            const isSnowball = task.type === 'snowball' || task.type === 'debt-min';
            const lastLog = getLastLog(task.id);
            const payCount = getPayCount(task.id);
            const freqLabels = { semanal: 'Sem', quincenal: 'Quin', mensual: 'Mens' };
            return (
              <div key={task.id}>
                <div
                  onClick={() => toggleTask(quincena, task.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${task.done
                    ? 'bg-slate-900/50 border-slate-800'
                    : task.type === 'income'
                      ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/40'
                      : isSnowball
                        ? 'bg-indigo-900/20 border-indigo-800/50 hover:bg-indigo-900/40'
                        : (task.type === 'variable' && (task.adelanto || 0) > task.amount)
                          ? 'bg-red-900/20 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                          : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {task.done ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className={`text-sm font-medium block ${task.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {task.isDynamic ? `${task.text} ${activeDebt.name}` : task.text}
                      </span>
                      {task.done && lastLog && (
                        <span className="text-[10px] text-emerald-400/70 flex items-center gap-1 mt-0.5">
                          <Check className="w-3 h-3" /> Pagado {formatDateShort(lastLog.date)} • ${lastLog.amount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {task.type !== 'income' && !task.done && (
                      <button
                        onClick={(e) => handleAdelanto(e, quincena, task.id)}
                        className="text-slate-500 hover:text-emerald-400 p-1"
                        title="Ingresar Adelanto / Deducción"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="text-right">
                      <span className={`text-sm font-bold flex items-center gap-1.5 ${task.done
                        ? 'text-slate-500'
                        : task.type === 'income'
                          ? 'text-blue-400'
                          : isSnowball ? 'text-indigo-400' : 'text-slate-300'
                        }`}>
                        {task.type === 'income' ? '+' : '-'}${effectiveAmount}
                      </span>
                      {task.adelanto > 0 && (
                        <span className={`text-[10px] mt-0.5 block font-bold ${task.adelanto > task.amount ? 'text-red-400' : 'text-emerald-500'}`}>
                          {task.adelanto > task.amount ? '¡Sobregiro!: ' : 'Adelanto: '}${task.adelanto}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info de pago: conteo y próxima fecha */}
                {lastLog && (
                  <div className="flex items-center justify-between mx-2 mt-1 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/50 text-[10px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <History className="w-3 h-3" /> Pagos: <span className="text-slate-300 font-bold">{payCount}</span>
                      <span className="text-slate-600 mx-1">|</span>
                      <span className="text-slate-400">{freqLabels[lastLog.frequency] || lastLog.frequency}</span>
                    </span>
                    <span className="text-amber-400/80 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> Sig: {formatDateShort(lastLog.nextPayDate)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen text-slate-300 font-sans pb-20 transition-colors duration-1000 ${getThemeClass()}`}>

      {/* Header */}
      <header className="glass sticky top-0 z-20 border-b border-white/5">
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-fuchsia-500 animate-gradient"></div>
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              Plan Financiero <span className="gradient-text">2026</span>
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/30">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> <span className="text-white font-bold">{racha}</span> racha
              </span>
              {achievements.firstQPerfect && <span title="1er Paso" className="bg-emerald-500/15 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Trophy className="w-3 h-3" /> Invicto</span>}
              {achievements.debtDestroyer && <span title="Destructor" className="bg-indigo-500/15 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Destructor</span>}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex glass p-1 rounded-xl w-auto gap-0.5">
            {['contable', 'dashboard', 'fechas', 'historial', 'bolsillos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all capitalize ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
              >
                {tab === 'contable' && <CheckSquare className="w-3.5 h-3.5" />}
                {tab === 'dashboard' && <LayoutDashboard className="w-3.5 h-3.5" />}
                {tab === 'fechas' && <Calendar className="w-3.5 h-3.5" />}
                {tab === 'historial' && <History className="w-3.5 h-3.5" />}
                {tab === 'bolsillos' && <Briefcase className="w-3.5 h-3.5" />}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6 mt-4">

        {/* ================= VISTA: MI CONTABLE ================= */}
        {activeTab === 'contable' && (
          <div className="space-y-5 animate-fadeUp">

            {/* NEW: Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Ingresos', value: `$${totalIncome.toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Gastos', value: `$${totalExpense.toLocaleString()}`, icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                { label: 'Deuda Total', value: `$${totalDebtBalance.toLocaleString()}`, icon: <CreditCard className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                { label: 'Hoy', value: new Date().toLocaleDateString('es', { day: 'numeric', month: 'short' }), icon: <Calendar className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.bg} border rounded-xl p-3 card-hover`}>
                  <div className={`flex items-center gap-1.5 ${stat.color} mb-1`}>
                    {stat.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-lg font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start glass-card text-indigo-300 p-4 rounded-xl text-sm gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-indigo-200">⚔️ Meta Activa: {activeDebt.name}</p>
                  <p className="text-indigo-400/70 text-xs mt-0.5">Cierra el mes cuando ambas quincenas estén listas.</p>
                </div>
              </div>
              <button
                onClick={cerrarMes}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20 text-sm"
              >
                <AlertCircle className="w-4 h-4" /> Cierre de Mes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {renderChecklist(q1Tasks, 1)}
              {renderChecklist(q2Tasks, 2)}
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-8 rounded-3xl text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-900/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>

              <div className="text-left flex-1 z-10 w-full">
                <h3 className="text-emerald-300 font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" /> Fuego contra {activeDebt.name}
                </h3>
                <p className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter shadow-emerald-500/20 drop-shadow-lg">
                  ${poderAtaqueActiva}
                </p>
                <div className="mt-4 pt-4 border-t border-emerald-500/20 text-xs text-emerald-300/80 flex flex-col gap-1.5 font-medium">
                  <div className="flex justify-between items-center gap-2">
                    <span>Manteniendo otras deudas:</span>
                    <span className="font-mono text-emerald-100">${totalMinimosOtras}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-emerald-400 font-bold">
                    <span>Poder de Destrucción Total:</span>
                    <span className="font-mono">${poderTotalDeudas}</span>
                  </div>
                </div>
              </div>

              {/* Side Hustle Component */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl w-full md:w-80 shadow-2xl z-10 flex-shrink-0">
                <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2 text-sm"><PlusCircle className="w-4 h-4 text-emerald-400" /> Activar Ingreso Extra</h4>

                <form onSubmit={addSideHustle} className="space-y-3">
                  <input
                    type="text" required
                    value={newHustleDesc} onChange={e => setNewHustleDesc(e.target.value)}
                    placeholder="Ej. Uber, Venta..."
                    className="w-full bg-slate-900/50 text-sm border-slate-700/50 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                  <div className="flex gap-2">
                    <span className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 text-slate-400 flex items-center justify-center font-bold">$</span>
                    <input
                      type="number" required min="1" step="0.01"
                      value={newHustleAmount} onChange={e => setNewHustleAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 text-sm border-slate-700/50 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition-all mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    Inyectar Fuego
                  </button>
                </form>

                {sideHustles.length > 0 && (
                  <div className="mt-4 max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {sideHustles.map(h => (
                      <div key={h.id} className="flex justify-between items-center text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                        <span className="text-slate-300 truncate pr-2">{h.desc}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">+${h.amount}</span>
                          <button onClick={() => deleteSideHustle(h.id)} className="text-slate-500 hover:text-red-400">&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VISTA: DASHBOARD / CALCULADORA ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Progreso Global Dinamica */}
            <section className="glass-card p-6 rounded-2xl relative overflow-hidden">
              {achievements.debtDestroyer && <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>}
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-bold mb-1 text-white flex items-center gap-2 relative z-10">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Misión Principal
              </h2>
              <div className="flex items-baseline gap-3 mb-6 relative z-10">
                <span className="text-3xl font-black text-white">${totalDebtBalance.toLocaleString()}</span>
                <span className="text-sm text-slate-500 line-through">${deudaTotalInicial.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  -{Math.round(((deudaTotalInicial - totalDebtBalance) / deudaTotalInicial) * 100)}%
                </span>
              </div>

              <div className="space-y-4 stagger-children relative z-10">
                {debts.map((debt, i) => {
                  const isSaldada = debt.balance <= 0;
                  const isActiva = activeDebt.id === debt.id;
                  const pct = isSaldada ? 100 : Math.max(5, 100 - (debt.balance / debt.initial) * 100);

                  return (
                    <div key={debt.id} className={`p-4 rounded-xl border transition-all ${isActiva ? 'bg-indigo-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : isSaldada ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/40'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${isSaldada ? 'bg-emerald-500 text-white' : isActiva ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                              {isSaldada ? '✓' : i + 1}
                            </span>
                            <span className={`font-bold text-sm ${isSaldada ? 'text-slate-500 line-through' : 'text-white'}`}>
                              {debt.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 ml-8">
                            <button
                              onClick={() => {
                                openEditModal({
                                  type: 'debtBalance',
                                  title: 'Editar Balance',
                                  subtitle: debt.name,
                                  value: debt.balance,
                                  inputType: 'number',
                                  placeholder: '0.00',
                                  onConfirm: (val) => {
                                    const newBal = parseFloat(val);
                                    if (!isNaN(newBal)) {
                                      setDebts(debts.map(d => d.id === debt.id ? { ...d, balance: Math.max(0, newBal) } : d));
                                    }
                                  }
                                });
                              }}
                              className="text-lg font-black text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 group"
                              title="Click para editar balance"
                            >
                              ${debt.balance.toLocaleString()}
                              <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                            </button>
                            {debt.apr > 0 && (
                              <span className="text-[10px] text-red-400/60 bg-red-500/10 px-1.5 py-0.5 rounded font-mono">{debt.apr}% APR</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isSaldada ? 'bg-emerald-500/20 text-emerald-400' :
                            isActiva ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-inset ring-indigo-500/40' :
                              'bg-slate-800 text-slate-500'
                            }`}>
                            {isSaldada ? '¡Saldada! 🎉' : isActiva ? '⚔️ Objetivo' : 'En Espera'}
                          </span>
                          {!isSaldada && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-400" /> {payoffDatesMemo[debt.id] || "---"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-full transition-all duration-1000 rounded-full ${isSaldada ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          isActiva ? 'bg-gradient-to-r from-indigo-600 via-indigo-400 to-cyan-400 animate-shimmer relative' :
                            'bg-slate-600'
                          }`} style={{ width: `${pct}%` }}>
                        </div>
                      </div>
                      <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
                        <span>{pct.toFixed(0)}% pagado</span>
                        <span>${(debt.initial - debt.balance).toLocaleString()} abonado</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Meta RD */}
            <section className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-6 rounded-2xl border border-blue-800/50">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                Viaje a RD (Meta: Julio - $2,000)
              </h2>
              <p className="text-sm text-blue-200/70 mb-4">
                Automático Walmart ($340) + Manual ($160) = $500/mes.
              </p>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: '60%' }}>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </section>

            {/* Próximos Pagos Dinámicos */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Próximos Pagos
                </h2>
                <button
                  onClick={() => setActiveTab('fechas')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  Ver Calendario
                </button>
              </div>

              {(() => {
                // Obtener último log por tarea (solo los más recientes)
                const allTasks = [...q1Tasks, ...q2Tasks];
                const uniqueTaskLogs = {};
                paymentLogs.forEach(log => {
                  if (!uniqueTaskLogs[log.taskId] || new Date(log.date) > new Date(uniqueTaskLogs[log.taskId].date)) {
                    uniqueTaskLogs[log.taskId] = log;
                  }
                });

                const upcoming = Object.values(uniqueTaskLogs)
                  .filter(log => new Date(log.nextPayDate) >= new Date())
                  .sort((a, b) => new Date(a.nextPayDate) - new Date(b.nextPayDate));

                if (upcoming.length === 0) {
                  return <p className="text-sm text-slate-500">Marca pagos en la pestaña Contable para ver aquí cuándo toca el siguiente.</p>;
                }

                const freqLabels = { semanal: 'Semanal', quincenal: 'Quincenal', mensual: 'Mensual' };

                return (
                  <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {upcoming.map(log => {
                      const task = allTasks.find(t => t.id === log.taskId);
                      const payCount = getPayCount(log.taskId);
                      const daysUntil = Math.ceil((new Date(log.nextPayDate) - new Date()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysUntil <= 2;

                      return (
                        <div key={log.taskId} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isUrgent ? 'bg-red-900/10 border-red-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                              {task ? (task.isDynamic ? `${task.text} ${activeDebt.name}` : task.text) : log.taskId}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500">{freqLabels[log.frequency]}</span>
                              <span className="text-[10px] text-slate-600">•</span>
                              <span className="text-[10px] text-slate-500">Pagos: {payCount}</span>
                              <span className="text-[10px] text-slate-600">•</span>
                              <span className="text-[10px] text-slate-400">Último: ${log.amount}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <span className={`text-sm font-bold block ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                              {formatDateShort(log.nextPayDate)}
                            </span>
                            <span className={`text-[10px] font-medium ${isUrgent ? 'text-red-300' : 'text-slate-500'}`}>
                              {daysUntil === 0 ? '¡Hoy!' : daysUntil === 1 ? 'Mañana' : `en ${daysUntil} días`}
                            </span>
                          </div>
                          {task && (
                            <button
                              onClick={() => {
                                openEditModal({
                                  type: 'taskAmount',
                                  title: 'Editar Monto de Tarea',
                                  subtitle: task.text,
                                  value: task.amount,
                                  inputType: 'number',
                                  placeholder: '0.00',
                                  onConfirm: (val) => {
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed) && parsed > 0) {
                                      const inQ1 = q1Tasks.find(t => t.id === log.taskId);
                                      if (inQ1) {
                                        setQ1Tasks(q1Tasks.map(t => t.id === log.taskId ? { ...t, amount: parsed } : t));
                                      } else {
                                        setQ2Tasks(q2Tasks.map(t => t.id === log.taskId ? { ...t, amount: parsed } : t));
                                      }
                                    }
                                  }
                                });
                              }}
                              className="ml-2 text-slate-600 hover:text-emerald-400 transition p-1"
                              title="Editar monto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </section>

            {/* Gráfica de Distribución (NUEVO) */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center justify-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-400" />
                Distribución de Presupuesto (Base)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: 'Gastos Fijos', value: expenses.reduce((a, c) => a + c.amount, 0) },
                      { name: 'Abono Deudas', value: totalMinimosOtras + poderAtaqueActiva },
                      { name: 'Variables/Ahorro', value: Math.max(0, totalIncome - expenses.reduce((a, c) => a + c.amount, 0) - (totalMinimosOtras + poderAtaqueActiva)) }
                    ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Rastreador Fondo de Emergencia (NUEVO) */}
            {(() => {
              const costoVidaMes = expenses.reduce((acc, curr) => acc + curr.amount, 0);
              const metaEmergencia3Meses = costoVidaMes * 3;
              const fondoActualVal = wallets.find(w => w.id === 'ahorros')?.balance || 0;
              const pctEmergencia = Math.min(100, (fondoActualVal / metaEmergencia3Meses) * 100);

              return (
                <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-6 rounded-2xl border border-indigo-800/50">
                  <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Fondo de Emergencia (3 Meses)
                  </h2>
                  <div className="flex justify-between text-sm text-indigo-200/70 mb-4">
                    <span>Actual: ${fondoActualVal.toLocaleString()}</span>
                    <span>Meta: ${metaEmergencia3Meses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full relative transition-all duration-1000" style={{ width: `${pctEmergencia}%` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 animate-pulse rounded-full blur-sm"></div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Simulador WhatIf (NUEVO) */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative z-10">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-fuchsia-400" />
                Máquina del Tiempo (Simulador)
              </h2>
              <p className="text-sm text-slate-400 mb-4">¿Qué pasaría si añades un extra constante a tus pagos mensuales?</p>

              <div className="flex gap-2 mb-6">
                <span className="bg-slate-800 border border-slate-700 rounded-xl px-4 text-slate-400 flex items-center justify-center font-bold">$</span>
                <input
                  type="number"
                  placeholder="Inyección extra recurrente"
                  value={whatIfInput}
                  onChange={(e) => setWhatIfInput(e.target.value)}
                  className="flex-1 bg-slate-800 text-sm border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all font-mono"
                />
                <button
                  onClick={() => setWhatIfExtra(Number(whatIfInput) || 0)}
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)]"
                >
                  Simular
                </button>
              </div>

              {whatIfExtra > 0 && (
                <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                  <h3 className="text-sm font-bold text-fuchsia-300">Nuevas Fechas Estimadas (vs Actual):</h3>
                  {debts.map(d => {
                    const actualDate = payoffDatesMemo[d.id] || "---";
                    const newDate = whatIfDatesMemo[d.id] || "---";
                    if (d.balance <= 0) return null;
                    return (
                      <div key={'sim-' + d.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-sm text-slate-200 font-medium">{d.name}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-slate-500 line-through">{actualDate}</span>
                          <ArrowRight className="w-4 h-4 text-fuchsia-500" />
                          <span className="text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-1 rounded">{newDate}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

          </div>
        )}

        {/* ================= VISTA: FECHAS / CALENDARIO ================= */}
        {activeTab === 'fechas' && (
          <div className="space-y-6 animate-fadeUp">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-400" /> Calendario de Pagos
                </h2>
                <p className="text-sm text-slate-500 mt-1">Próximos pagos y registro de actividad.</p>
              </div>
            </div>

            {/* Próximos Pagos desde Payment Logs */}
            {(() => {
              // Build a lookup map of task names from q1/q2 tasks
              const taskNameMap = {};
              [...q1Tasks, ...q2Tasks].forEach(t => {
                taskNameMap[t.id] = t.text;
              });

              const upcoming = [];
              paymentLogs.forEach(log => {
                if (log.nextPayDate) {
                  const nextDate = new Date(log.nextPayDate);
                  const now = new Date();
                  const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));
                  if (diffDays >= 0 && diffDays <= 60) {
                    upcoming.push({ ...log, diffDays, nextDate });
                  }
                }
              });
              // Deduplicate by taskId, keep most recent
              const seen = new Map();
              upcoming.forEach(u => {
                if (!seen.has(u.taskId) || new Date(u.date) > new Date(seen.get(u.taskId).date)) {
                  seen.set(u.taskId, u);
                }
              });
              const uniqueUpcoming = Array.from(seen.values()).sort((a, b) => a.diffDays - b.diffDays);

              // Frequency labels
              const freqLabel = { semanal: 'Semanal', quincenal: 'Quincenal', mensual: 'Mensual' };

              return (
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" /> Próximos Pagos Programados
                  </h3>
                  {uniqueUpcoming.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No hay pagos programados aún. Marca tareas como pagadas para ver aquí la próxima fecha.</p>
                  ) : (
                    <div className="space-y-2 stagger-children">
                      {uniqueUpcoming.map((item, idx) => {
                        const taskName = taskNameMap[item.taskId] || item.taskId;
                        return (
                          <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${item.diffDays <= 2 ? 'bg-red-500/10 border-red-500/30' : item.diffDays <= 7 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800/50 border-slate-700/30'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black ${item.diffDays <= 2 ? 'bg-red-500/20 text-red-400' : item.diffDays <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                                {item.diffDays}d
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{taskName}</p>
                                <p className="text-[10px] text-slate-500">{formatDateShort(item.nextPayDate)} · <span className="text-slate-400">{freqLabel[item.frequency] || item.frequency}</span></p>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-slate-300">${item.amount}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Historial reciente de pagos */}
            {paymentLogs.length > 0 && (
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <History className="w-4 h-4" /> Últimos Pagos Realizados
                </h3>
                <p className="text-[10px] text-slate-600 mb-2">Toca un pago para editar o eliminar.</p>
                <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                  {(() => {
                    const taskNameMap = {};
                    [...q1Tasks, ...q2Tasks].forEach(t => { taskNameMap[t.id] = t.text; });
                    const freqLabel = { semanal: 'Sem', quincenal: 'Quin', mensual: 'Mens' };
                    return paymentLogs.slice(0, 30).map((log, idx) => (
                      <button
                        key={log.id || idx}
                        onClick={() => openEditPaymentLog(log)}
                        className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-300 truncate">{taskNameMap[log.taskId] || log.taskId}</p>
                            <p className="text-[10px] text-slate-600">{formatDateShort(log.date)} · {freqLabel[log.frequency] || log.frequency}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-bold text-emerald-400">${log.amount}</span>
                          <Edit3 className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ================= VISTA: HISTORIAL ================= */}
        {activeTab === 'historial' && (
          <div className="space-y-6 animate-fadeUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-400" /> Archivo Mensual
              </h2>
              <button
                onClick={() => {
                  if (history.length === 0) return alert('No hay historial para exportar.');
                  const headers = "ID,Fecha,Total_Abonado_Principal,Intereses_Pagados,SideHustles,Deuda_Restante\n";
                  const rows = history.map(h => `${h.id},${h.fecha},${h.totalPagado},${h.totalInteres.toFixed(2)},${h.sideHustlesMonto},${h.deudaRestante}`).join("\n");
                  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", "historial_financiero_2026.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-bold border border-slate-700 shadow-lg"
              >
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
                <History className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Sin historial aún</h3>
                <p className="text-slate-500 mt-2">Cierra tu primer mes para ver los registros aquí.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map(record => (
                  <div key={record.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/30 transition-colors shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                      <span className="font-bold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> {record.fecha}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono">Cierre: #{record.id.toString().slice(-4)}</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Abonado a Capital</p>
                        <p className="text-emerald-400 font-bold text-lg">${record.totalPagado.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Interés Generado</p>
                        <p className="text-red-400 font-bold text-lg">${record.totalInteres.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Side Hustles Mes</p>
                        <p className="text-indigo-400 font-bold text-lg">${record.sideHustlesMonto.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Deuda Restante</p>
                        <p className="text-slate-300 font-bold text-lg">${record.deudaRestante.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= VISTA: BOLSILLOS (WALLETS) ================= */}
        {activeTab === 'bolsillos' && (
          <div className="space-y-6 animate-fadeUp">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-400" /> Control de Cuentas
                </h2>
                <p className="text-sm text-slate-500 mt-1">Administra tus fondos por cuenta.</p>
              </div>
              <div className="glass-card px-4 py-2 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Liquidez Total</p>
                <p className="text-lg font-black text-emerald-400">${wallets.reduce((a, c) => a + c.balance, 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {wallets.map((wallet, idx) => {
                const colors = wallet.id === 'cheques' ? { gradient: 'from-blue-500/10 to-blue-900/5', border: 'border-blue-500/20 hover:border-blue-400/40', icon: 'text-blue-400', glow: 'bg-blue-500/10' } :
                  wallet.id === 'ahorros' ? { gradient: 'from-fuchsia-500/10 to-fuchsia-900/5', border: 'border-fuchsia-500/20 hover:border-fuchsia-400/40', icon: 'text-fuchsia-400', glow: 'bg-fuchsia-500/10' } :
                    { gradient: 'from-emerald-500/10 to-emerald-900/5', border: 'border-emerald-500/20 hover:border-emerald-400/40', icon: 'text-emerald-400', glow: 'bg-emerald-500/10' };

                return (
                  <div key={wallet.id} className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} p-5 rounded-2xl relative overflow-hidden group transition-all card-hover shadow-xl`}>
                    <div className={`absolute -right-6 -top-6 w-28 h-28 ${colors.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="flex items-center gap-2.5 mb-4 relative z-10">
                      <div className={`w-10 h-10 rounded-xl ${colors.glow} flex items-center justify-center`}>
                        {wallet.id === 'cheques' && <Briefcase className={`w-5 h-5 ${colors.icon}`} />}
                        {wallet.id === 'ahorros' && <PiggyBank className={`w-5 h-5 ${colors.icon}`} />}
                        {wallet.id === 'efectivo' && <Wallet className={`w-5 h-5 ${colors.icon}`} />}
                      </div>
                      <span className="font-bold text-white text-sm">{wallet.name}</span>
                    </div>

                    <div className="mb-5 relative z-10">
                      <p className="text-3xl font-black text-white tracking-tighter">
                        ${wallet.balance.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 relative z-10">
                      <button
                        onClick={() => {
                          openEditModal({
                            type: 'walletAdd',
                            title: 'Agregar Fondos',
                            subtitle: wallet.name,
                            value: 0,
                            inputType: 'number',
                            placeholder: '0.00',
                            onConfirm: (val) => {
                              const parsed = parseFloat(val);
                              if (!isNaN(parsed) && parsed > 0) {
                                const newWallets = [...wallets];
                                newWallets[idx].balance += parsed;
                                setWallets(newWallets);
                              }
                            }
                          });
                        }}
                        className="flex-1 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 font-bold py-2.5 rounded-xl transition-all border border-white/10 hover:border-emerald-500/40 text-sm"
                      >+ Agregar</button>
                      <button
                        onClick={() => {
                          openEditModal({
                            type: 'walletRemove',
                            title: 'Retirar Fondos',
                            subtitle: wallet.name,
                            value: 0,
                            inputType: 'number',
                            placeholder: '0.00',
                            onConfirm: (val) => {
                              const parsed = parseFloat(val);
                              if (!isNaN(parsed) && parsed > 0) {
                                const newWallets = [...wallets];
                                newWallets[idx].balance = Math.max(0, newWallets[idx].balance - parsed);
                                setWallets(newWallets);
                              }
                            }
                          });
                        }}
                        className="flex-1 bg-white/5 hover:bg-red-500/20 text-red-400 font-bold py-2.5 rounded-xl transition-all border border-white/10 hover:border-red-500/40 text-sm"
                      >- Retirar</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 mt-8 mb-24 md:mb-8 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
        <p className="text-slate-600 text-xs">
          © 2026 fernely • <a href="https://fernelydev.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-500/70 hover:text-emerald-400 font-medium transition-colors">fernelydev.com</a>
        </p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5" style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
        <div className="flex justify-around items-center px-1 pt-1">
          {['contable', 'dashboard', 'fechas', 'historial', 'bolsillos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center w-full py-2 gap-0.5 rounded-xl transition-all relative ${activeTab === tab ? 'text-emerald-400' : 'text-slate-500'}`}
            >
              {activeTab === tab && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-400 rounded-full"></div>}
              {tab === 'contable' && <CheckSquare className="w-5 h-5" />}
              {tab === 'dashboard' && <LayoutDashboard className="w-5 h-5" />}
              {tab === 'fechas' && <Calendar className="w-5 h-5" />}
              {tab === 'historial' && <History className="w-5 h-5" />}
              {tab === 'bolsillos' && <Briefcase className="w-5 h-5" />}
              <span className="text-[9px] font-bold capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ====== MODAL DE PAGO ====== */}
      {showPayModal && (() => {
        const { quincena, taskId } = showPayModal;
        const tasks = quincena === 1 ? q1Tasks : q2Tasks;
        const task = tasks.find(t => t.id === taskId);
        const previewNext = calcNextPayDate(payModalFreq);
        if (!task) return null;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowPayModal(null)}>
            <div className="glass-card rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-emerald-900/30 relative animate-fadeUp border-emerald-500/10" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowPayModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Registrar Pago
              </h3>
              <p className="text-sm text-slate-400 mb-5">{task.isDynamic ? `${task.text} ${activeDebt.name}` : task.text}</p>

              {/* Monto real */}
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Cantidad Pagada</label>
              <div className="flex gap-2 mb-5">
                <span className="bg-slate-800 border border-slate-700 rounded-xl px-4 text-emerald-400 flex items-center justify-center font-black text-lg">$</span>
                <input
                  type="number"
                  value={payModalAmount}
                  onChange={e => setPayModalAmount(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                  autoFocus
                />
              </div>

              {/* Frecuencia */}
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">¿Cada cuánto pagas esto?</label>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { key: 'semanal', label: 'Semanal', sub: '7 días' },
                  { key: 'quincenal', label: 'Quincenal', sub: '15 días' },
                  { key: 'mensual', label: 'Mensual', sub: '30 días' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setPayModalFreq(opt.key)}
                    className={`p-3 rounded-xl border text-center transition-all ${payModalFreq === opt.key
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <span className="text-sm font-bold block">{opt.label}</span>
                    <span className="text-[10px] text-slate-500">{opt.sub}</span>
                  </button>
                ))}
              </div>

              {/* Preview siguiente fecha */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-300/70">Próximo pago será:</p>
                  <p className="text-amber-300 font-bold text-sm">{formatDateShort(previewNext)}</p>
                </div>
              </div>

              {/* Confirmar */}
              <button
                onClick={confirmPayment}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirmar Pago
              </button>
            </div>
          </div>
        );
      })()}

      {/* ====== UNIVERSAL EDIT MODAL ====== */}
      {editModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
          <div className="glass-card rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-indigo-900/20 relative animate-fadeUp border-indigo-500/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditModal(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{editModal.title}</h3>
                <p className="text-xs text-slate-500">{editModal.subtitle}</p>
              </div>
            </div>

            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">
              {editModal.inputType === 'number' ? 'Valor' : 'Información'}
            </label>
            <div className="flex gap-2 mb-5">
              {editModal.inputType === 'number' && (
                <span className="bg-slate-800 border border-slate-700 rounded-xl px-4 text-indigo-400 flex items-center justify-center font-black text-lg">$</span>
              )}
              <input
                type={editModal.inputType || 'text'}
                value={editModalValue}
                onChange={e => setEditModalValue(e.target.value)}
                placeholder={editModal.placeholder || ''}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') confirmEditModal(); }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all border border-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEditModal}
                className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-black py-3 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== EDIT PAYMENT LOG MODAL ====== */}
      {editPayLog && (() => {
        const taskNameMap = {};
        [...q1Tasks, ...q2Tasks].forEach(t => { taskNameMap[t.id] = t.text; });
        const taskName = taskNameMap[editPayLog.taskId] || editPayLog.taskId;
        const freqLabel = { semanal: 'Semanal', quincenal: 'Quincenal', mensual: 'Mensual' };

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4" onClick={() => setEditPayLog(null)}>
            <div className="glass-card rounded-3xl p-6 w-full max-w-sm shadow-2xl shadow-emerald-900/20 relative animate-fadeUp border-emerald-500/10" onClick={e => e.stopPropagation()}>
              <button onClick={() => setEditPayLog(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Editar Pago</h3>
                  <p className="text-xs text-slate-500">{taskName}</p>
                </div>
              </div>

              {/* Info del pago */}
              <div className="bg-slate-800/50 rounded-xl p-3 mb-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="text-slate-300 font-medium">{formatDateShort(editPayLog.date)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Frecuencia:</span>
                  <span className="text-slate-300 font-medium">{freqLabel[editPayLog.frequency] || editPayLog.frequency}</span>
                </div>
                {editPayLog.nextPayDate && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Próximo pago:</span>
                    <span className="text-amber-400 font-medium">{formatDateShort(editPayLog.nextPayDate)}</span>
                  </div>
                )}
              </div>

              {/* Monto editable */}
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Monto Pagado</label>
              <div className="flex gap-2 mb-5">
                <span className="bg-slate-800 border border-slate-700 rounded-xl px-4 text-emerald-400 flex items-center justify-center font-black text-lg">$</span>
                <input
                  type="number"
                  value={editPayLogAmount}
                  onChange={e => setEditPayLogAmount(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-lg font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') confirmEditPaymentLog(); }}
                />
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setEditPayLog(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmEditPaymentLog}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Guardar
                </button>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => {
                  if (window.confirm('¿Eliminar este pago del historial?')) {
                    deletePaymentLog(editPayLog.id);
                  }
                }}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2.5 rounded-xl text-xs transition-all border border-red-500/20 hover:border-red-500/40 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar Pago
              </button>
            </div>
          </div>
        );
      })()}


    </div>
  );
};

export default App;
