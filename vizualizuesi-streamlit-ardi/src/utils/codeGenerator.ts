import { DataItem } from "../types";

export function generateStreamlitCode(data: DataItem[]): string {
  const dataRows = data.map(item => {
    return `    {"Emri": "${item.name}", "Kategoria": "${item.category}", "Vlera": ${item.value}, "Sasia": ${item.quantity}}`;
  }).join(",\n");

  return `import streamlit as st
import pandas as pd
import plotly.express as px

# 1. Konfigurimi i faqes
st.set_page_config(
    page_title="Vizualizuesi i të Dhënave",
    page_icon="📊",
    layout="wide"
)

# Titulli dhe Përshkrimi kryesor
st.title("📊 Vizualizuesi i të Dhënave Streamlit")
st.markdown("Ky aplikacion është gjeneruar automatikisht nga **Vizualizuesi Streamlit**.")

# 2. Të dhënat fillestare (Seed data)
@st.cache_data
def load_data():
    raw_data = [
${dataRows}
    ]
    return pd.DataFrame(raw_data)

df = load_data()

# Ruajtja e të dhënave në session_state për mbrojtjen nga rindezja (re-run)
if "dataset" not in st.session_state:
    st.session_state["dataset"] = df

df_current = st.session_state["dataset"]

# 3. Menuja Anësore (Sidebar) & Inputet
st.sidebar.header("⚙️ Konfigurimi & Filtrimi")

# 🔹 SHTIMI I TË DHËNAVE REJA (st.sidebar.text_input & st.sidebar.number_input)
st.sidebar.subheader("➕ Shto të Dhëna të Reja")
risi_emri = st.sidebar.text_input("Emri i Aktivitetit/Produktit", value="Aktiviteti i Ri")
risi_kategoria = st.sidebar.selectbox("Kategoria", ["Shitje", "Marketing", "Zhvillim", "Operacionale", "Logjistikë", "Tjera"])
risi_vlera = st.sidebar.number_input("Vlera (Euro)", min_value=0, value=500, step=50)
risi_sasia = st.sidebar.number_input("Sasia", min_value=1, value=5, step=1)

# Butoni për të shtuar të dhënat në seancën aktuale
if st.sidebar.button("Shto të Dhënën"):
    ne_rresht_e_re = pd.DataFrame([{"Emri": risi_emri, "Kategoria": risi_kategoria, "Vlera": risi_vlera, "Sasia": risi_sasia}])
    st.session_state["dataset"] = pd.concat([st.session_state["dataset"], ne_rresht_e_re], ignore_index=True)
    st.sidebar.success(f"✓ '{risi_emri}' u shtua me sukses!")
    st.rerun()

# Butoni për të fshirë të dhënat dhe rivendosur ato fillestare
if st.sidebar.button("Rivendos të Dhënat Fillestare"):
    st.session_state["dataset"] = df
    st.sidebar.info("Të dhënat u rivendosën.")
    st.rerun()

st.sidebar.markdown("---")

# 🔹 FILTRIMI I TË DHËNAVE (st.sidebar.selectbox & st.sidebar.slider)
st.sidebar.subheader("🔍 Filtro të Dhënat")

# Listimi i kategorive unike për selektim
kategorite_unike = ["Të gjitha"] + list(df_current["Kategoria"].unique())
kategoria_e_zgjedhur = st.sidebar.selectbox("Filtro sipas Kategorisë", kategorite_unike)

# Filtrimi me Slider për Vlerën
vlera_maksimale = float(df_current["Vlera"].max()) if not df_current.empty else 1000.0
vlera_zgjedhur = st.sidebar.slider(
    "Vlera Minimale (Euro)",
    min_value=0.0,
    max_value=max(vlera_maksimale, 2000.0),
    value=0.0,
    step=10.0
)

# Aplikimi i filtrave
df_filtered = df_current.copy()
if kategoria_e_zgjedhur != "Të gjitha":
    df_filtered = df_filtered[df_filtered["Kategoria"] == kategoria_e_zgjedhur]

df_filtered = df_filtered[df_filtered["Vlera"] >= vlera_zgjedhur]

# 4. Vizualizimi i të Dhënave (Main Panel)
kolona1, kolona2 = st.columns([1, 12 / 10])

with kolona1:
    st.subheader("📋 Tabela Dinamike")
    st.dataframe(df_filtered, use_container_width=True)
    
    # Metrika të përgjithshme
    st.markdown("### 📊 Statistikat")
    totali_vleres = df_filtered["Vlera"].sum() if not df_filtered.empty else 0
    totali_sasia = df_filtered["Sasia"].sum() if not df_filtered.empty else 0
    mesatarja_vleres = df_filtered["Vlera"].mean() if not df_filtered.empty else 0
    
    m1, m2, m3 = st.columns(3)
    m1.metric("Totali i Vlerës", f"{totali_vleres:,.2f} €")
    m2.metric("Sasia Totale", f"{totali_sasia:,} njësi")
    m3.metric("Mesatarja", f"{mesatarja_vleres:,.2f} €")

with kolona2:
    st.subheader("📈 Vizualizimi Grafik")
    if not df_filtered.empty:
        tipi_grafikut = st.selectbox("Zgjidh tipin e grafikut", [
            "Bar Chart (Vlera sipas Emrit)", 
            "Pie Chart (Vlera sipas Kategorisë)", 
            "Line Chart (Sasia sipas Emrit)"
        ])
        
        if tipi_grafikut == "Bar Chart (Vlera sipas Emrit)":
            fig = px.bar(
                df_filtered, 
                x="Emri", 
                y="Vlera", 
                color="Kategoria", 
                title="Vlera për çdo Aktivitet/Produkt",
                template="plotly_white"
            )
            st.plotly_chart(fig, use_container_width=True)
            
        elif tipi_grafikut == "Pie Chart (Vlera sipas Kategorisë)":
            fig = px.pie(
                df_filtered, 
                values="Vlera", 
                names="Kategoria", 
                title="Përpjesëtimi i Vlerës sipas Kategorisë",
                hole=0.4
            )
            st.plotly_chart(fig, use_container_width=True)
            
        elif tipi_grafikut == "Line Chart (Sasia sipas Emrit)":
            fig = px.line(
                df_filtered, 
                x="Emri", 
                y="Sasia", 
                markers=True, 
                title="Trendi i Sasisë për çdo Aktivitet",
                template="plotly_white"
            )
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Nuk ka të dhëna për të shfaqur grafikun. Ju lutem rregulloni filtrat ose shtoni të dhëna të reja.")
`;
}

export function generateRequirementsTxt(): string {
  return `streamlit>=1.30.0
pandas>=2.0.0
plotly>=5.18.0
`;
}
