document.addEventListener('DOMContentLoaded', () => {
    // 計算ボタンの要素を取得
    const calculateButton = document.getElementById('calculateButton');
    if (!calculateButton) {
        console.error('計算ボタンが見つかりません');
        return;
    }

    // 計算ボタンのクリックイベント
    calculateButton.addEventListener('click', () => {
        try {
            // 入力値の取得とログ出力
            const age = Number(document.getElementById('age').value) || 0;
            const baseIncome = Number(document.getElementById('baseIncome').value) || 0;
            const bonus = Number(document.getElementById('bonus').value) || 0;
            console.log('Income values:', { baseIncome, bonus });
            
            // 年齢の妥当性チェック
            if (age <= 0 || age > 120) {
                showError('有効な年齢を入力してください（1-120）');
                return;
            }

            const insuranceRates = {
                healthInsurance: Number(document.getElementById('healthInsuranceRate').value) || 0,
                nursing: Number(document.getElementById('nursingInsuranceRate').value) || 0,
                pension: Number(document.getElementById('pensionInsuranceRate').value) || 0
            };
            console.log('Insurance rates:', insuranceRates);

            const dependentsInfo = {
                general: Number(document.getElementById('generalDependents').value) || 0,
                special: Number(document.getElementById('specialDependents').value) || 0,
                elderly: Number(document.getElementById('elderlyDependents').value) || 0
            };
            console.log('Dependents info:', dependentsInfo);

            const medicalInfo = {
                expenses: Number(document.getElementById('medicalExpenses').value) || 0,
                insurance: Number(document.getElementById('medicalInsurance').value) || 0
            };
            console.log('Medical info:', medicalInfo);

            const additionalDeductions = {
                spouseIncome: Number(document.getElementById('spouseIncome').value) || 0,
                smallBusinessPremium: Number(document.getElementById('smallBusinessPremium').value) || 0,
                donationAmount: Number(document.getElementById('donationAmount').value) || 0
            };
            console.log('Additional deductions:', additionalDeductions);

            // 計算実行
            const calculator = new TaxCalculator();
            const result = calculator.calculateTax(
                baseIncome,
                bonus,
                insuranceRates,
                dependentsInfo,
                medicalInfo,
                additionalDeductions,
                age
            );

            // 結果の表示
            displayResults(result, age);
            hideError();
        } catch (error) {
            console.error('詳細なエラー情報:', error);
            showError('計算中にエラーが発生しました。入力内容をご確認ください');
        }
    });
});

// エラーメッセージを表示する関数
function showError(message) {
    console.log('エラーメッセージを表示:', message);
    const errorDiv = document.getElementById('errorMessage') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // 計算結果をクリア
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
}

// エラーメッセージを非表示にする関数
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// エラーメッセージ用のdiv要素を作成する関数
function createErrorDiv() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.className = 'error-message';
    
    // 計算ボタンの後に挿入
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton && calculateButton.parentNode) {
        calculateButton.parentNode.insertBefore(errorDiv, calculateButton.nextSibling);
    }
    
    return errorDiv;
}

// 結果表示関数（変更なし）
function displayResults(result, age) {
    const resultDiv = document.getElementById('result');
    let html = `
        <h3>計算結果</h3>
        
        <div class="result-section">
            <h4>基本情報</h4>
            <table class="result-table">
                <tr><td>年齢</td><td>${age}歳</td></tr>
                <tr><td>総収入</td><td>${result.totalIncome.toLocaleString()}円</td></tr>
                <tr><td>給与所得控除</td><td>${result.salaryDeduction.toLocaleString()}円</td></tr>
                <tr><td>給与所得</td><td>${result.salaryIncome.toLocaleString()}円</td></tr>
            </table>
        </div>

        <div class="result-section">
            <h4>社会保険料</h4>
            <table class="result-table">
                <tr><td>健康保険料（年間）</td><td>${result.insuranceDeductions.healthInsurance.toLocaleString()}円</td></tr>
                ${age >= 40 && age < 65 
                    ? `<tr><td>介護保険料（年間）</td><td>${result.insuranceDeductions.nursingInsurance.toLocaleString()}円</td></tr>`
                    : `<tr><td>介護保険料</td><td>対象外（${age}歳）</td></tr>`}
                <tr><td>厚生年金保険料（年間）</td><td>${result.insuranceDeductions.pension.toLocaleString()}円</td></tr>
                <tr><td>雇用保険料（年間）</td><td>${result.insuranceDeductions.unemploymentInsurance.toLocaleString()}円</td></tr>
                <tr class="total"><td>社会保険料合計</td><td>${result.insuranceDeductions.total.toLocaleString()}円</td></tr>
            </table>
        </div>

        <div class="result-section">
            <h4>所得控除</h4>
            <table class="result-table">
                <tr><td>基礎控除</td><td>${result.deductions.basicDeduction.toLocaleString()}円</td></tr>
                <tr><td>社会保険料控除</td><td>${result.deductions.insuranceDeduction.toLocaleString()}円</td></tr>
                <tr><td>配偶者控除</td><td>${result.deductions.spouseDeduction.toLocaleString()}円</td></tr>
                <tr><td>扶養控除</td><td>${result.deductions.dependentDeduction.toLocaleString()}円</td></tr>
                <tr><td>医療費控除</td><td>${result.deductions.medicalDeduction.toLocaleString()}円</td></tr>
                <tr><td>小規模企業共済等掛金控除</td><td>${result.deductions.smallBusinessDeduction.toLocaleString()}円</td></tr>
                <tr><td>寄附金控除</td><td>${result.deductions.donationDeduction.toLocaleString()}円</td></tr>
                <tr class="total"><td>所得控除合計</td><td>${result.deductions.totalDeduction.toLocaleString()}円</td></tr>
            </table>
        </div>

        <div class="result-section">
            <h4>課税所得と税額</h4>
            <table class="result-table">
                <tr><td>課税所得金額</td><td>${result.taxableIncome.toLocaleString()}円</td></tr>
                <tr><td>所得税（復興特別所得税含む）</td><td>${result.incomeTax.toLocaleString()}円</td></tr>
                <tr><td>住民税</td><td>${result.residentTax.toLocaleString()}円</td></tr>
                <tr class="total"><td>税額合計</td><td>${(result.incomeTax + result.residentTax).toLocaleString()}円</td></tr>
            </table>
        </div>

        <div class="result-section">
            <h4>手取り額</h4>
            <table class="result-table">
                <tr><td>年間手取り額</td><td>${result.netIncome.toLocaleString()}円</td></tr>
                <tr><td>月額手取り（概算）</td><td>${Math.floor(result.netIncome / 12).toLocaleString()}円</td></tr>
            </table>
        </div>
    `;
    
    resultDiv.innerHTML = html;
}

class TaxCalculator {
    calculateTax(baseIncome, bonus, insuranceRates, dependentsInfo, medicalInfo, additionalDeductions, age) {
        try {
            // 1. 給与収入の計算
            const totalIncome = Number(baseIncome) + Number(bonus) || 0;

            // 2. 社会保険料の計算
            const insuranceDeductions = this.calculateInsuranceDeductions(totalIncome, insuranceRates, age);

            // 3. 給与所得控除の計算
            const salaryDeduction = this.calculateSalaryDeduction(totalIncome);

            // 4. 給与所得の計算
            const salaryIncome = totalIncome - salaryDeduction;

            // 5. 所得控除の計算
            const deductions = this.calculateTotalDeductions(
                salaryIncome,
                insuranceDeductions,
                dependentsInfo,
                medicalInfo,
                additionalDeductions
            );

            // 6. 課税所得の計算
            const taxableIncome = Math.max(0, salaryIncome - deductions.totalDeduction);

            // 7. 所得税の計算
            const incomeTax = this.calculateIncomeTax(taxableIncome);

            // 8. 住民税の計算
            const residentTax = this.calculateResidentTax(taxableIncome);

            // 9. 手取り額の計算
            const netIncome = this.calculateNetIncome(
                totalIncome,
                insuranceDeductions,
                incomeTax,
                residentTax
            );

            return {
                totalIncome: totalIncome,
                salaryDeduction: salaryDeduction,
                salaryIncome: salaryIncome,
                insuranceDeductions: insuranceDeductions,
                deductions: deductions,
                taxableIncome: taxableIncome,
                incomeTax: incomeTax,
                residentTax: residentTax,
                netIncome: netIncome
            };
        } catch (error) {
            console.error('Tax calculation error:', error);
            throw error;
        }
    }

    // 社会保険料の計算
    calculateInsuranceDeductions(income, rates, age) {
        // 標準報酬月額の上限は139万円
        const monthlyIncome = Math.min(Math.floor(income / 12), 1390000);
        
        const healthInsurance = monthlyIncome * (rates.healthInsurance / 100) * 12;
        
        // 介護保険料は40歳以上65歳未満の場合のみ徴収
        const nursingInsurance = (age >= 40 && age < 65) 
            ? monthlyIncome * (rates.nursing / 100) * 12 
            : 0;
        
        const pension = Math.min(monthlyIncome * (rates.pension / 100) * 12, 650000);
        const unemploymentInsurance = income * 0.003;

        return {
            healthInsurance: Math.floor(healthInsurance),
            nursingInsurance: Math.floor(nursingInsurance),
            pension: Math.floor(pension),
            unemploymentInsurance: Math.floor(unemploymentInsurance),
            total: Math.floor(healthInsurance + nursingInsurance + pension + unemploymentInsurance)
        };
    }

    // 給与所得控除の計算（令和4年以降）
    calculateSalaryDeduction(income) {
        if (income <= 1625000) {
            return 550000;
        } else if (income <= 1800000) {
            return income * 0.4;
        } else if (income <= 3600000) {
            return income * 0.3 + 180000;
        } else if (income <= 6600000) {
            return income * 0.2 + 540000;
        } else if (income <= 8500000) {
            return income * 0.1 + 1200000;
        } else {
            return 1950000;
        }
    }

    // 所得控除の合計額計算
    calculateTotalDeductions(salaryIncome, insuranceDeductions, dependentsInfo, medicalInfo, additionalDeductions) {
        // 基礎控除（所得に応じて逓減）
        let basicDeduction = this.calculateBasicDeduction(salaryIncome);

        // 社会保険料控除
        let insuranceDeduction = insuranceDeductions.total;

        // 配偶者控除
        let spouseDeduction = this.calculateSpouseDeduction(additionalDeductions.spouseIncome, salaryIncome);

        // 扶養控除
        let dependentDeduction = this.calculateDependentDeduction(dependentsInfo);

        // 医療費控除
        let medicalDeduction = this.calculateMedicalDeduction(medicalInfo);

        // 小規模企業共済等掛金控除
        let smallBusinessDeduction = Number(additionalDeductions.smallBusinessPremium) || 0;

        // 寄附金控除
        let donationDeduction = this.calculateDonationDeduction(additionalDeductions.donationAmount, salaryIncome);

        return {
            basicDeduction,
            insuranceDeduction,
            spouseDeduction,
            dependentDeduction,
            medicalDeduction,
            smallBusinessDeduction,
            donationDeduction,
            totalDeduction: basicDeduction + insuranceDeduction + spouseDeduction + 
                          dependentDeduction + medicalDeduction + smallBusinessDeduction + 
                          donationDeduction
        };
    }

    // 基礎控除の計算（令和2年以降）
    calculateBasicDeduction(income) {
        if (income <= 24000000) {
            return 480000;
        } else if (income <= 24500000) {
            return 320000;
        } else if (income <= 25000000) {
            return 160000;
        }
        return 0;
    }

    // 配偶者控除の計算（令和2年以降）
    calculateSpouseDeduction(spouseIncome, primaryIncome) {
        spouseIncome = Number(spouseIncome) || 0;
        
        if (spouseIncome > 1330000) return 0;
        
        if (primaryIncome <= 9000000) {
            if (spouseIncome <= 950000) return 380000;
            if (spouseIncome <= 1000000) return 260000;
            if (spouseIncome <= 1050000) return 130000;
        } else if (primaryIncome <= 9500000) {
            if (spouseIncome <= 950000) return 260000;
            if (spouseIncome <= 1000000) return 180000;
            if (spouseIncome <= 1050000) return 90000;
        } else if (primaryIncome <= 10000000) {
            if (spouseIncome <= 950000) return 130000;
            if (spouseIncome <= 1000000) return 90000;
            if (spouseIncome <= 1050000) return 45000;
        }
        
        return 0;
    }

    // 扶養控除の計算
    calculateDependentDeduction(dependentsInfo) {
        return (Number(dependentsInfo.general) || 0) * 380000 +
               (Number(dependentsInfo.special) || 0) * 630000 +
               (Number(dependentsInfo.elderly) || 0) * 480000;
    }

    // 医療費控除の計算
    calculateMedicalDeduction(medicalInfo) {
        const expenses = Number(medicalInfo.expenses) || 0;
        const insurance = Number(medicalInfo.insurance) || 0;
        const actualExpenses = Math.max(0, expenses - insurance);
        const minimum = Math.min(actualExpenses, Math.max(100000, expenses * 0.05));
        return Math.max(0, actualExpenses - minimum);
    }

    // 寄附金控除の計算
    calculateDonationDeduction(donationAmount, totalIncome) {
        donationAmount = Number(donationAmount) || 0;
        if (donationAmount <= 2000) return 0;
        const maxDeduction = totalIncome * 0.4;
        return Math.min(donationAmount - 2000, maxDeduction);
    }

    // 所得税の計算（令和4年以降）
    calculateIncomeTax(taxableIncome) {
        let tax = 0;
        if (taxableIncome <= 1950000) {
            tax = taxableIncome * 0.05;
        } else if (taxableIncome <= 3300000) {
            tax = taxableIncome * 0.1 - 97500;
        } else if (taxableIncome <= 6950000) {
            tax = taxableIncome * 0.2 - 427500;
        } else if (taxableIncome <= 9000000) {
            tax = taxableIncome * 0.23 - 636000;
        } else if (taxableIncome <= 18000000) {
            tax = taxableIncome * 0.33 - 1536000;
        } else if (taxableIncome <= 40000000) {
            tax = taxableIncome * 0.4 - 2796000;
        } else {
            tax = taxableIncome * 0.45 - 4796000;
        }

        // 復興特別所得税（所得税額の2.1%）
        const reconstructionTax = tax * 0.021;

        return Math.floor(tax + reconstructionTax);
    }

    // 住民税の計算
    calculateResidentTax(taxableIncome) {
        // 住民税の標準税率：都道府県民税4%、市町村民税6%
        return Math.floor(taxableIncome * 0.1);
    }

    // 手取り額の計算
    calculateNetIncome(totalIncome, insuranceDeductions, incomeTax, residentTax) {
        return Math.floor(totalIncome - insuranceDeductions.total - incomeTax - residentTax);
    }
} 