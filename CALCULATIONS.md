# Business Logic & Calculation Specifications

This document outlines all mathematical calculations, formulas, rounding conventions, and 5+ test input/output verification pairs for the Hambire Solutions Bullion & Jewellery ERP system.

---

## 1. Fine Gold (Pure Gold Weight) Calculation
- **Context**: Used across Exchange POS, Buy-Sell, Jewellery, Touch Form, and Refinery.
- **Formula**:
  $$\text{Fine Gold (gm)} = \frac{\text{Weight (gm)} \times \text{Touch (\%)}}{100}$$
- **Rounding Convention**: 3 decimal places (standard bullion milligram precision: `0.001 gm`).

### Test Cases:
| Case ID | Input: `weight` (gm) | Input: `touch` (%) | Expected Output: `fineGold` (gm) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **FG-01** | `10.000` | `91.60` (22K) | `9.160` | Standard 22 Karat gold item |
| **FG-02** | `100.000` | `99.90` | `99.900` | Bullion bar 99.9% purity |
| **FG-03** | `0.000` | `75.00` | `0.000` | Zero weight edge case |
| **FG-04** | `14.523` | `83.50` | `12.127` | Decimal milligram weight & odd purity |
| **FG-05** | `1250.750` | `92.45` | `1156.318` | Large wholesale batch |
| **FG-06** | `5.000` | `0.00` | `0.000` | Zero touch edge case |

---

## 2. Gold Allowance & Net Gold Difference
- **Context**: Exchange POS terminal (`#index`).
- **Formulas**:
  $$\text{After Fine} = \text{Fine Gold} + \text{Extra Gold Allowance}$$
  $$\text{Diff Gold} = \text{After Fine} - \text{Given Gold}$$
- **Rounding**: 3 decimal places (`0.001 gm`). Negative indicates shop owes customer gold; positive indicates customer owes shop gold.

### Test Cases:
| Case ID | Input: `fineGold` | Input: `extraGold` | Input: `givenGold` | Expected `afterFine` | Expected `diffGold` | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GA-01** | `9.160` | `0.000` | `9.160` | `9.160` | `0.000` | Exact 1:1 settlement |
| **GA-02** | `9.160` | `+0.500` | `9.000` | `9.660` | `+0.660` | Positive allowance, excess gold due |
| **GA-03** | `15.000` | `-0.200` | `16.000` | `14.800` | `-1.200` | Negative allowance (deduction), shop owes gold |
| **GA-04** | `0.000` | `0.000` | `0.000` | `0.000` | `0.000` | All zeros edge case |
| **GA-05** | `50.250` | `+1.000` | `0.000` | `51.250` | `+51.250` | No gold given physically |

---

## 3. Gold Difference Monetary Valuation (Diff Amount)
- **Context**: Converts outstanding gold difference into cash at market rate quoted per 10 grams.
- **Formula**:
  $$\text{Diff Amount (₹)} = \frac{\text{Diff Gold (gm)} \times \text{Rate (₹/10gm)}}{10}$$
- **Rounding**: 2 decimal places (`₹ 0.01`).

### Test Cases:
| Case ID | Input: `diffGold` (gm) | Input: `rate` (₹/10gm) | Expected Output: `diffAmount` (₹) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **DA-01** | `10.000` | `75000` | `75000.00` | Standard 10gm unit calculation |
| **DA-02** | `1.000` | `78500` | `7850.00` | Single gram rate conversion |
| **DA-03** | `-2.500` | `80000` | `-20000.00` | Negative gold balance conversion |
| **DA-04** | `0.000` | `75000` | `0.00` | Zero balance edge case |
| **DA-05** | `14.325` | `82450` | `118109.63` | Irregular decimal milligram weight |

---

## 4. Final Cash Settlement
- **Context**: Adds handling or labor charges to the Diff Amount.
- **Formula**:
  $$\text{Final Cash (₹)} = \text{Diff Amount (₹)} + \text{Charges (₹)}$$

### Test Cases:
| Case ID | Input: `diffAmount` (₹) | Input: `charges` (₹) | Expected Output: `finalCash` (₹) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **FC-01** | `75000.00` | `500.00` | `75500.00` | Standard positive settlement with fee |
| **FC-02** | `-20000.00` | `300.00` | `-19700.00` | Negative settlement with fee adjustment |
| **FC-03** | `0.00` | `250.00` | `250.00` | Zero gold difference, fee only |
| **FC-04** | `150000.00` | `0.00` | `150000.00` | Zero charges edge case |
| **FC-05** | `118109.63` | `1500.50` | `119610.13` | Decimal cents precision |

---

## 5. Bhavcut (Instant Currency ⇄ Gold Conversion)
- **Context**: Real-time bullion trading tool converting between rupee value and pure gold weight at market rate.
- **Formulas**:
  $$\text{Gold from Cash (gm)} = \frac{\text{Amount (₹)} \times 10}{\text{Rate (₹/10gm)}}$$
  $$\text{Cash from Gold (₹)} = \frac{\text{Gold (gm)} \times \text{Rate (₹/10gm)}}{10}$$

### Test Cases (Cash → Gold):
| Case ID | Input: `amount` (₹) | Input: `rate` (₹/10gm) | Expected Output: `gold` (gm) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **BG-01** | `75000.00` | `75000.00` | `10.000` | Exact 10 gram equivalent |
| **BG-02** | `100000.00` | `80000.00` | `12.500` | Clean division |
| **BG-03** | `50000.00` | `78450.00` | `6.373` | Repeating decimal rounded to 3 digits |
| **BG-04** | `0.00` | `75000.00` | `0.000` | Zero cash edge case |
| **BG-05** | `5000000.00` | `85000.00` | `588.235` | Wholesale transaction |

### Test Cases (Gold → Cash):
| Case ID | Input: `gold` (gm) | Input: `rate` (₹/10gm) | Expected Output: `amount` (₹) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **BC-01** | `10.000` | `75000.00` | `75000.00` | Standard 10gm reverse test |
| **BC-02** | `12.500` | `80000.00` | `100000.00` | Inverse of BG-02 |
| **BC-03** | `6.373` | `78450.00` | `49996.19` | Roundtrip precision check |
| **BC-04** | `0.000` | `75000.00` | `0.00` | Zero gold reverse |
| **BC-05** | `588.235` | `85000.00` | `4999997.50` | Large value roundtrip check |

---

## 6. Buy-Sell Bullion Net Cash Calculation
- **Context**: Purchase and sale terminal (`#buy_sell/index`).
- **Formulas**:
  $$\text{Gross Cash} = \frac{\text{Weight (gm)} \times \text{Rate (₹/10gm)}}{10}$$
  $$\text{Net Cash} = \text{Gross Cash} - \text{Discount}$$

### Test Cases:
| Case ID | Input: `weight` (gm) | Input: `rate` (₹/10gm) | Input: `discount` (₹) | Expected `netCash` (₹) | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BS-01** | `100.000` | `75000.00` | `500.00` | `749500.00` | Bulk 100gm purchase with discount |
| **BS-02** | `25.000` | `80000.00` | `0.00` | `200000.00` | Zero discount |
| **BS-03** | `0.000` | `75000.00` | `0.00` | `0.00` | Zero weight |
| **BS-04** | `1.500` | `76000.00` | `100.00` | `11300.00` | Small retail sale |
| **BS-05** | `50.000` | `78000.00` | `390000.00` | `0.00` | Full discount edge case |

---

## 7. Loan Ledger Running Balance Update
- **Context**: Double-entry ledger updating outstanding customer Gold (gm) and Cash (₹).
- **Formulas**:
  $$\text{New Balance} = \text{Old Balance} + (\text{Transaction Amount} \times \text{Multiplier})$$
  Where $\text{Multiplier} = +1$ for Jama (Credit / In) and $-1$ for Udhar (Debit / Out).

### Test Cases:
| Case ID | Input: `oldBal` | Input: `transAmt` | Input: `isJama` | Expected `newBal` | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LB-01** | `10.000` (gm) | `5.000` (gm) | `true` (Jama) | `15.000` | Adding credit to positive balance |
| **LB-02** | `10.000` (gm) | `15.000` (gm) | `false` (Udhar)| `-5.000` | Crossing from positive to negative |
| **LB-03** | `-50000.00` (₹)| `30000.00` (₹)| `true` (Jama) | `-20000.00`| Partial repayment of debt |
| **LB-04** | `0.00` (₹) | `25000.00` (₹)| `false` (Udhar)| `-25000.00`| New loan from zero balance |
| **LB-05** | `10000.00` (₹)| `10000.00` (₹)| `false` (Udhar)| `0.00` | Exact clearance of balance |

---

## 8. Karat (K) from Touch Purity % Conversion
- **Context**: PVC Certificate and Touch Form.
- **Formula**:
  $$\text{Karat (K)} = \frac{\text{Touch (\%)} \times 24}{100}$$
- **Rounding**: 2 decimal places.

### Test Cases:
| Case ID | Input: `touch` (%) | Expected Output: `karat` (K) | Description |
| :--- | :--- | :--- | :--- |
| **KT-01** | `91.60` | `21.98` (~22K) | Standard 22 Karat (916) hallmark |
| **KT-02** | `75.00` | `18.00` (18K) | Exact 18 Karat (750) |
| **KT-03** | `58.50` | `14.04` (~14K) | Exact 14 Karat (585) |
| **KT-04** | `99.90` | `23.98` (~24K) | Bullion 24 Karat |
| **KT-05** | `0.00` | `0.00` | Base zero |

---

## 9. Jewellery Net Weight & Manufacturing Wastage
- **Context**: Jewellery order tracking (`#jewellery/view`).
- **Formulas**:
  $$\text{Net Weight} = \text{Gross Weight} - \text{Less Weight}$$
  $$\text{Fine Gold Requirement} = \frac{\text{Net Weight} \times \text{Purity } \%}{100}$$
  $$\text{Wastage Weight (gm)} = \frac{\text{Net Weight} \times \text{Wastage } \%}{100}$$
  $$\text{Total Pure Metal Due} = \text{Fine Gold} + \text{Wastage Weight}$$
  $$\text{Labour Amount (₹)} = \text{Net Weight} \times \text{Labour Rate per gm}$$

### Test Cases:
| Case ID | `grossWt` | `lessWt` | `purity` | `wastagePct` | `labourRate` | Expected `netWt` | Expected `fineGold` | Expected `wastageWt` | Expected `totalDue` | Expected `labourAmt` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **JW-01**| `25.500` | `2.500` | `91.60` | `3.00` | `450.00` | `23.000` | `21.068` | `0.690` | `21.758` | `10350.00` |
| **JW-02**| `10.000` | `0.000` | `75.00` | `0.00` | `300.00` | `10.000` | `7.500` | `0.000` | `7.500` | `3000.00` |
| **JW-03**| `0.000` | `0.000` | `91.60` | `2.50` | `400.00` | `0.000` | `0.000` | `0.000` | `0.000` | `0.00` |
| **JW-04**| `55.800` | `5.800` | `92.00` | `4.50` | `600.00` | `50.000` | `46.000` | `2.250` | `48.250` | `30000.00` |
| **JW-05**| `100.000` | `12.350` | `83.50` | `2.00` | `500.00` | `87.650` | `73.188` | `1.753` | `74.941` | `43825.00` |

---

## 10. Refinery Melting Loss & Service Tax Invoice
- **Context**: Refinery Billing (`#refinery/view`).
- **Formulas**:
  $$\text{Melting Loss (gm)} = \text{Gross Weight} - \text{Melt Weight}$$
  $$\text{Refining Loss (gm)} = \text{Melt Weight} - \text{Refined Weight}$$
  $$\text{Service Charge (₹)} = \text{Gross Weight} \times \text{Charge per gm}$$
  $$\text{GST Amount (₹)} = \frac{\text{Service Charge} \times \text{GST } \%}{100}$$
  $$\text{Total Invoice (₹)} = \text{Service Charge} + \text{GST Amount}$$

### Test Cases:
| Case ID | `grossWt` | `meltWt` | `refinedWt` | `chargePerGm`| `gstPct` | Expected `meltLoss` | Expected `refineLoss`| Expected `svcCharge` | Expected `gstAmt` | Expected `totalInv` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01**| `500.000` | `485.000`| `480.000` | `20.00` | `18.0` | `15.000` | `5.000` | `10000.00` | `1800.00` | `11800.00` |
| **RF-02**| `100.000` | `100.000`| `100.000` | `25.00` | `0.0` | `0.000` | `0.000` | `2500.00` | `0.00` | `2500.00` |
| **RF-03**| `250.500` | `245.200`| `240.000` | `15.00` | `5.0` | `5.300` | `5.200` | `3757.50` | `187.88` | `3945.38` |
| **RF-04**| `0.000` | `0.000` | `0.000` | `20.00` | `18.0` | `0.000` | `0.000` | `0.00` | `0.00` | `0.00` |
| **RF-05**| `1200.000`| `1180.000`| `1175.000`| `30.00` | `18.0` | `20.000` | `5.000` | `36000.00` | `6480.00` | `42480.00` |

---

## 11. Metallurgical Alloy Requirement (Khar / Mel)
- **Context**: Adjusting alloy purity (`#additional/khar/view`).
- **Formula**:
  $$\text{Required Pure or Alloy Metal} = \frac{\text{Current Weight} \times |\text{Current Purity} - \text{Target Purity}|}{\text{Target Purity} - \text{Alloy Purity}}$$

### Test Cases:
| Case ID | `currentWt` (gm) | `currentPurity` (%) | `targetPurity` (%) | `alloyPurity` (%) | Expected Required Metal (gm) | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KM-01**| `100.000` | `99.90` | `91.60` | `0.00` (Copper) | `9.061` | Lowering 99.9% gold to 91.6% by adding copper |
| **KM-02**| `100.000` | `85.00` | `91.60` | `100.00` (Pure Gold)| `78.571` | Raising 85% gold to 91.6% by adding 24K pure gold |
| **KM-03**| `50.000` | `91.60` | `91.60` | `0.00` | `0.000` | Already at target purity |
| **KM-04**| `0.000` | `99.90` | `91.60` | `0.00` | `0.000` | Zero current weight |
| **KM-05**| `250.000` | `95.00` | `75.00` | `0.00` | `66.667` | Diluting to 18K purity |
