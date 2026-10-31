# AgroSmart AI – Agronomic Suitability Scoring Methodology

**Problem ID:** HACK-P302  
**Standard Version:** 1.2.0  

---

## 1. Mathematical Formulation

The core suitability engine computes a composite index ranging from **0 to 100**:

$$\text{Suitability Score} = 100 \times \frac{\sum_{i \in \text{Applicable}} \left( w_i \times s_i \right)}{\sum_{i \in \text{Applicable}} w_i}$$

Where:
- $w_i$ is the configured agronomic weight for factor $i$.
- $s_i \in [0.0, 1.0]$ is the factor compatibility score.
- Missing inputs are excluded from both the numerator and the denominator sum.

### Factor Weight Distribution

| Agronomic Parameter | Default Weight ($w_i$) | Biological Rationale |
|---|---:|---|
| **Soil Texture** | 20% | Dictates water retention, root penetration, and bulk density. |
| **Soil pH** | 15% | Regulates nutrient availability and aluminum/iron toxicities. |
| **Temperature** | 15% | Governs photosynthetic rates, anthesis, and vegetative growth. |
| **Rainfall / Water** | 10% | Hydrological requirement and drought/waterlogging tolerance. |
| **Nitrogen (N)** | 10% | Vegetative canopy growth and chlorophyll synthesis. |
| **Phosphorus (P)** | 10% | Early root development, tillering, and energy transfer. |
| **Potassium (K)** | 10% | Stomatal conductance, drought hardiness, and disease resistance. |
| **Relative Humidity** | 5% | Foliar microclimate and transpiration pressure. |
| **Growing Season** | 5% | Photoperiod and seasonal monsoon/winter alignment. |

---

## 2. Factor Scoring Curves

### Continuous Factors (pH, Temperature, Rainfall, Humidity)
We implement a trapezoidal tolerance response curve:

$$s_i(x) = 
\begin{cases} 
1.0 & \text{if } x \in [\text{OptimalMin}, \text{OptimalMax}] \\
0.5 + 0.5 \left(\frac{x - \text{Min}}{\text{OptimalMin} - \text{Min}}\right) & \text{if } x \in [\text{Min}, \text{OptimalMin}) \\
0.5 + 0.5 \left(\frac{\text{Max} - x}{\text{Max} - \text{OptimalMax}}\right) & \text{if } x \in (\text{OptimalMax}, \text{Max}] \\
\max(0.05, 0.45 - \text{penalty}) & \text{if } x < \text{Min} \text{ or } x > \text{Max}
\end{cases}$$

### Categorical Factors
- **Soil Type:** Match = $1.0$; Mismatch = $0.25$ (with warning).
- **Cropping Season:** Match = $1.0$; Mismatch = $0.15$ (strong seasonal mismatch penalty).

---

## 3. Suitability Categories

- **80% – 100% (Highly Suitable):** Plot conditions fall cleanly within optimal ranges.
- **65% – 79% (Moderately Suitable):** Viable crop with minor management interventions required.
- **50% – 64% (Marginally Suitable):** Notable environmental or soil discrepancies; proceed with caution.
- **< 50% (Not Recommended):** Severe biological constraints or seasonal incompatibility.

---

## 4. Advisory Disclaimer

AgroSmart AI scores represent **ecological suitability advisory guidance**, not a guaranteed yield prediction. Actual farm harvest is contingent upon seed variety, localized drainage, microclimate, and field management.
