import { DataItem } from './types';

export const INITIAL_DATA: DataItem[] = [
  { id: '#001', name: 'MacBook Pro M3 14"', category: 'Elektronikë', price: 1899, quantity: 15, date: '2026-01-15' },
  { id: '#002', name: 'Karrige Ergonomike Pune', category: 'Mobilje', price: 245, quantity: 42, date: '2026-02-10' },
  { id: '#003', name: 'Monitor Dell UltraSharp 4K', category: 'Elektronikë', price: 650, quantity: 28, date: '2026-03-05' },
  { id: '#004', name: 'Llambë LED Inteligjente Tavoline', category: 'Shtëpiake', price: 45, quantity: 120, date: '2026-03-12' },
  { id: '#005', name: 'iPhone 16 Pro Max 256GB', category: 'Elektronikë', price: 1399, quantity: 35, date: '2026-04-02' },
  { id: '#006', name: 'Tavolinë me Lartësi të Rregullueshme', category: 'Mobilje', price: 420, quantity: 18, date: '2026-04-18' },
  { id: '#007', name: 'Fshesë Robot me Korrent', category: 'Shtëpiake', price: 380, quantity: 25, date: '2026-05-01' },
  { id: '#008', name: 'Kufje me Anulim Zhurme Sony WH-1000XM6', category: 'Elektronikë', price: 349, quantity: 50, date: '2026-05-15' },
  { id: '#009', name: 'Espresso Ekspres DeLonghi', category: 'Shtëpiake', price: 590, quantity: 22, date: '2026-05-28' },
  { id: '#010', name: 'Raft Librash Minimalist Druri', category: 'Mobilje', price: 175, quantity: 30, date: '2026-06-10' },
];

export const CATEGORIES = ['Të gjitha', 'Elektronikë', 'Mobilje', 'Shtëpiake'];

export function generatePythonStreamlitCode(): string {
  return `# Paneli i Analizës së Shitjeve (Streamlit Python App)
# Për ta rënduar në kompjuterin tuaj, instaloni Streamlit:
# pip install streamlit pandas plotly
# Dhe ekzekutoni: streamlit run app.py

import streamlit as st
import pandas as pd
import plotly.express as px

# Konfigurimi i faqes
st.set_page_config(page_title="Analiza e Shitjeve", page_icon="📊", layout="wide")

# Inicializimi i të dhënave në session state
if 'data' not in st.session_state:
    st.session_state.data = pd.DataFrame([
        {"id": "#001", "name": "MacBook Pro M3 14\\"", "category": "Elektronikë", "price": 1899, "quantity": 15},
        {"id": "#002", "name": "Karrige Ergonomike Pune", "category": "Mobilje", "price": 245, "quantity": 42},
        {"id": "#003", "name": "Monitor Dell UltraSharp 4K", "category": "Elektronikë", "price": 650, "quantity": 28},
        {"id": "#004", "name": "Llambë LED Inteligjente Tavoline", "category": "Shtëpiake", "price": 45, "quantity": 120},
        {"id": "#005", "name": "iPhone 16 Pro Max", "category": "Elektronikë", "price": 1399, "quantity": 35},
        {"id": "#006", "name": "Tavolinë Elektrike Lartësi", "category": "Mobilje", "price": 420, "quantity": 18},
    ])

# ==================== MENUJA ANËSORE (SIDEBAR) ====================
st.sidebar.title("🔸 Menuja & Inputet")

st.sidebar.subheader("➕ Shtimi i të dhënave")
new_name = st.sidebar.text_input("Emri i produktit", placeholder="p.sh. Tablet iPad")
new_cat = st.sidebar.selectbox("Kategoria e produktit", ["Elektronikë", "Mobilje", "Shtëpiake"])
new_price = st.sidebar.number_input("Çmimi (€)", min_value=1.0, value=100.0, step=10.0)
new_qty = st.sidebar.number_input("Sasia", min_value=1, value=10, step=1)

if st.sidebar.button("Shto Artikull", type="primary", use_container_width=True):
    if new_name:
        new_row = {
            "id": f"#{len(st.session_state.data)+1:03d}",
            "name": new_name,
            "category": new_cat,
            "price": new_price,
            "quantity": new_qty
        }
        st.session_state.data = pd.concat([st.session_state.data, pd.DataFrame([new_row])], ignore_index=True)
        st.sidebar.success("Të dhënat u shtuan me sukses!")

st.sidebar.divider()

st.sidebar.subheader("🔍 Filtrimi i të dhënave")
selected_category = st.sidebar.selectbox("Zgjidh Kategorinë", ["Të gjitha", "Elektronikë", "Mobilje", "Shtëpiake"])
max_price = int(st.session_state.data['price'].max() if not st.session_state.data.empty else 2000)
price_range = st.sidebar.slider("Intervali i çmimit (€)", 0, max_price, (0, max_price))

# Zbato filtrat
df = st.session_state.data.copy()
if selected_category != "Të gjitha":
    df = df[df['category'] == selected_category]
df = df[(df['price'] >= price_range[0]) & (df['price'] <= price_range[1])]
df['total_sales'] = df['price'] * df['quantity']

# ==================== TRUPI I PROGRAMIT (MAIN) ====================
st.title("📊 Paneli i Analizës së Shitjeve")
st.markdown("*Pasqyra dinamike e performancës së produkteve në kohë reale (Streamlit)*")

# Kartat e Statistikave
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Totali i Shitjeve", f"€{df['total_sales'].sum():,.2f}")
with col2:
    st.metric("Produkte të Filtruara", len(df))
with col3:
    avg_price = df['price'].mean() if not df.empty else 0
    st.metric("Mesatarja Çmimit", f"€{avg_price:,.2f}")

st.divider()

# Grafikët Dinamikë
col_chart1, col_chart2 = st.columns(2)

with col_chart1:
    st.subheader("📈 Shitjet sipas Kategorisë")
    if not df.empty:
        cat_sales = df.groupby('category')['total_sales'].sum().reset_index()
        fig_bar = px.bar(cat_sales, x='category', y='total_sales', color='category', text_auto='.2s')
        st.plotly_chart(fig_bar, use_container_width=True)

with col_chart2:
    st.subheader("🥧 Shpërndarja e Sasisë")
    if not df.empty:
        fig_pie = px.pie(df, names='category', values='quantity', hole=0.4)
        st.plotly_chart(fig_pie, use_container_width=True)

st.subheader("📋 Tabela Dinamike e të Dhënave")
st.dataframe(df, use_container_width=True)
`;
}
