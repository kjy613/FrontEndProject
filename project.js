// 테이블 가져오기
const table = document.getElementById("scoreTable");

var selectedRow = null; // 선택된 행

var gradeData ={
    1:[],
    2:[],
    3:[]
};

function loadGradeData(){
    const grade = document.getElementById('gradeSelect').value;
    const tableBody = document.querySelector('#scoreTable tbody');

    // 테이블 비우기
    tableBody.innerHTML = '';

    // 저장된 학년 데이터를 불러오기
    const data = gradeData[grade];

    data.forEach(rowData => {
        const newRow = document.createElement('tr');
        
        newRow.innerHTML = `
            <td>
                <select>
                    <option value="교양" ${rowData.이수 === '교양' ? 'selected' : ''}>교양</option>
                    <option value="전공" ${rowData.이수 === '전공' ? 'selected' : ''}>전공</option>
                </select>
            </td>
            <td>
                <select>
                    <option value="필수" ${rowData.필수 === '필수' ? 'selected' : ''}>필수</option>
                    <option value="선택" ${rowData.필수 === '선택' ? 'selected' : ''}>선택</option>
                </select>
            </td>
            <td><input type="text" value="${rowData.과목명}"></td>
            <td>
                <select onchange="updateRow(this)">
                    <option value="1" ${rowData.학점 === '1' ? 'selected' : ''}>1</option>
                    <option value="2" ${rowData.학점 === '2' ? 'selected' : ''}>2</option>
                    <option value="3" ${rowData.학점 === '3' ? 'selected' : ''}>3</option>
                </select>
            </td>
            <td><input type="number" min="0" max="20" value="${rowData.출석}" onchange="updateRow(this)"></td>
            <td><input type="number" min="0" max="20" value="${rowData.과제}" onchange="updateRow(this)"></td>
            <td><input type="number" min="0" max="30" value="${rowData.중간고사}" onchange="updateRow(this)"></td>
            <td><input type="number" min="0" max="30" value="${rowData.기말고사}" onchange="updateRow(this)"></td>
            <td class="total_score">0</td>
            <td class="totalAverage"></td>
            <td class="totalGrade">0</td>
        `;

        newRow.addEventListener('click', () => {
            if (selectedRow) {
                selectedRow.classList.remove('selected');
            }
            selectedRow = newRow;
            selectedRow.classList.add('selected');
        });

        tableBody.appendChild(newRow);
        updateRow(newRow.querySelector('input, select'));
    });

    updateTotals();

}

// 행 추가
function addRow(){
    const tableBody = document.querySelector('#scoreTable tbody');
    const newRow = document.createElement('tr');

    // ``로 여러 줄의 html작성
    newRow.innerHTML=`
    <td>
        <select>
            <option value="교양">교양</option>
            <option value="전공">전공</option>
        </select>
    </td>
    <td>
            <select>
                <option value="필수">필수</option>
                <option value="선택">선택</option>
            </select>
    </td>
    <td><input type="text" classname="과목명"></td>
    <td>
            <!-- ? -->
            <select onchange="updateRow(this)">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
    </td>
    <td><input type="number" min="0" max="20" value="0" onchange="updateRow(this)"></td>
    <td><input type="number" min="0" max="20" value="0" onchange="updateRow(this)"></td>
    <td><input type="number" min="0" max="30" value="0" onchange="updateRow(this)"></td>
    <td><input type="number" min="0" max="30" value="0" onchange="updateRow(this)"></td>
    <td class="total_score">0</td>
    <td class="totalAverage"></td>
    <td class="totalGrade">0</td>
    `;
    newRow.addEventListener('click', () => {
        if (selectedRow) {
            selectedRow.classList.remove('selected'); // 이전 선택된 행의 강조 제거
        }
        selectedRow = newRow;
        selectedRow.classList.add('selected'); // 선택된 행 강조
    });

    tableBody.appendChild(newRow);

    if (!validateRow(newRow)) {
        newRow.remove();
    }
}

// 삭제 기능
function deleteSelectedRow(){
    if(selectedRow){
        selectedRow.remove();
        selectedRow=null;
        updateTotals();
    }
    else{
        alert('삭제할 줄을 선택하세요.');
    }
}

// 저장
function saveData(){
    const grade = document.getElementById('gradeSelect').value;
    const rows = document.querySelectorAll('#scoreTable tbody tr');
    
    gradeData[grade] = [];

    rows.forEach(row => {

        // 각 행의 데이터를 업데이트하고 저장
        const pnp = parseInt(row.cells[3].querySelector('select').value);
        const attend = parseInt(row.cells[4].querySelector('input').value) || 0;
        const homew = parseInt(row.cells[5].querySelector('input').value) || 0;
        const midterm = parseInt(row.cells[6].querySelector('input').value) || 0;
        const finalterm = parseInt(row.cells[7].querySelector('input').value) || 0;

        // 총점 계산
        const totalScore = attend + homew + midterm + finalterm;
        row.querySelector('.total_score').textContent = totalScore;

        // 성적 계산
        const gradeValue = calculateGrade(totalScore, pnp);
        row.querySelector('.totalGrade').textContent = gradeValue;

        // 실패(F) 또는 Non Pass 표시 색상 업데이트
        if (gradeValue === 'F' || gradeValue === 'Non Pass') {
            row.querySelector('.totalGrade').classList.add('red-text');
        } else {
            row.querySelector('.totalGrade').classList.remove('red-text');
        }

const rowData = {
    이수: row.cells[0].querySelector('select').value,
    필수: row.cells[1].querySelector('select').value,
    과목명: row.cells[2].querySelector('input').value,
    학점: row.cells[3].querySelector('select').value,
    출석: row.cells[4].querySelector('input').value,
    과제: row.cells[5].querySelector('input').value,
    중간고사: row.cells[6].querySelector('input').value,
    기말고사: row.cells[7].querySelector('input').value
};
gradeData[grade].push(rowData);
    });

    sortTable(grade);

    loadGradeData();

}

function updateRow(input){
    const row = input.parentNode.parentNode;
    const pnp = parseInt(row.cells[3].querySelector('select').value);
    const attend = parseInt(row.cells[4].querySelector('input').value) || 0;
    const homew = parseInt(row.cells[5].querySelector('input').value) || 0;
    const midterm = parseInt(row.cells[6].querySelector('input').value) || 0;
    const finalterm = parseInt(row.cells[7].querySelector('input').value) || 0;

    const totalScore = attend + homew + midterm + finalterm;
    row.querySelector('.total_score').textContent = totalScore;

    const grade = calculateGrade(totalScore, pnp);
    row.querySelector('.totalGrade').textContent = grade;

    if (grade === 'F' || grade === 'Non Pass') {
        row.querySelector('.totalGrade').classList.add('red-text');
    } else {
        row.querySelector('.totalGrade').classList.remove('red-text');
    }
    
    if (!validateRow(row)) return;

    updateTotals();
}

function updateTotals(){
    const rows = document.querySelectorAll('#scoreTable tbody tr');

    let totalScore = 0;
    let t_pnp=0; // 학점
    let t_attd = 0; // 출석
    let t_hmwk = 0; // 과제
    let t_midt = 0; // 중간고사
    let t_fint = 0; // 기말고사


    // 계산 시 유효한 과목의 개수
    let validSubjects = 0;

    rows.forEach(row => {
        // 학점 가져오기
        const pnp = parseInt(row.cells[3].querySelector('select').value);
        const total = parseInt(row.querySelector('.total_score').textContent) || 0;
        const grade = row.querySelector('.totalGrade').textContent;

        const attd = parseInt(row.cells[4].querySelector('input').value);
        const hmwk = parseInt(row.cells[5].querySelector('input').value);
        const midt = parseInt(row.cells[6].querySelector('input').value);
        const fint = parseInt(row.cells[7].querySelector('input').value);

        if (pnp !== 1 && grade !== 'F' && grade !== 'Non Pass') {
            totalScore += total;
            t_attd += attd;
            t_hmwk += hmwk;
            t_midt += midt;
            t_fint += fint;
            t_pnp += pnp;
            validSubjects++;
        }
        // t_pnp += pnp; // 1학점이건 아니건 합계 추가
    });

    // 평균 계산
    const averageScore = validSubjects ? (totalScore / validSubjects).toFixed(2):0;
    //const grade = calculateGrade(totalScore);

    document.getElementById('total_score').textContent = totalScore;
    document.getElementById('totalAverage').textContent = averageScore; //validSubjects ? (totalScore / validSubjects).toFixed(2) : 0;
    //document.getElementById('totalGrade').textContent = grade
    
    document.getElementById('creditScore').textContent = t_pnp;
    document.getElementById('attendance').textContent = t_attd;
    document.getElementById('hw').textContent = t_hmwk;
    document.getElementById('mid').textContent = t_midt;
    document.getElementById('final').textContent = t_fint;

    //추가
    const gradeElement = document.getElementById('totalGrade');
    const finalGrade = calculateGrade(parseFloat(averageScore), 0);
    gradeElement.textContent = finalGrade;


}

//계산
function calculateGrade(totalScore, pnp){
    if (pnp === 1) {
        return totalScore >= 60 ? 'Pass' : 'Non Pass';
    }

    if(totalScore>=95){
        return "A+";
    }
    else if(totalScore<95 && totalScore>=90){
        return "A0";
    }
    else if(totalScore<90 && totalScore>=85){
        return "B+";
    }
    else if(totalScore<85 && totalScore>=80){
        return "B0";
    }
    else if(totalScore<80 && totalScore>=75){
        return "C+";
    }
    else if(totalScore<75 && totalScore>=70){
        return "C0";
    }
    else { return "F";}
}

// 조건 확인
function validateRow(row) {
    const subjectName = row.cells[2].querySelector('input').value.trim();
    const totalScore = parseInt(row.querySelector('.total_score').textContent) || 0;
    const attend = parseInt(row.cells[4].querySelector('input').value) || 0;
    const hw = parseInt(row.cells[5].querySelector('input').value) || 0;
    const midterm = parseInt(row.cells[6].querySelector('input').value) || 0;
    const finalterm = parseInt(row.cells[7].querySelector('input').value) || 0;
    const grade = row.querySelector('.totalGrade').textContent;

    // 과목명 중복 검사 (성적이 F인 경우 허용)
    const rows = document.querySelectorAll('#scoreTable tbody tr');
    let duplicate = false;
    rows.forEach(otherRow => {
        if (otherRow !== row && otherRow.cells[2].querySelector('input').value.trim() === subjectName) {
            const otherGrade = otherRow.querySelector('.totalGrade').textContent;
            if (otherGrade !== 'F') {
                duplicate = true;
            }
        }
    });

    if (duplicate) {
        alert('중복된 과목명이 있습니다. F 성적 외 과목은 중복될 수 없습니다.');
        row.cells[2].querySelector('input').value = '';
        return false;
    }

    // 출석 및 과제 점수 범위
    if (attend < 0 || attend > 20) {
        alert('출석 점수는 0 이상 20 이하여야 합니다.');
        row.cells[4].querySelector('input').value = 0;
        return false;
    }
    if (hw < 0 || hw > 20) {
        alert('과제 점수는 0 이상 20 이하여야 합니다.');
        row.cells[5].querySelector('input').value = 0;
        return false;
    }

    // 중간고사 및 기말고사 점수 범위
    if (midterm < 0 || midterm > 30) {
        alert('중간고사 점수는 0 이상 30 이하여야 합니다.');
        row.cells[6].querySelector('input').value = 0;
        return false;
    }
    if (finalterm < 0 || finalterm > 30) {
        alert('기말고사 점수는 0 이상 30 이하여야 합니다.');
        row.cells[7].querySelector('input').value = 0;
        return false;
    }

    // 총점 범위
    if (totalScore < 0 || totalScore > 100) {
        alert('총점은 0 이상 100 이하여야 합니다.');
        updateRow(row);
        return false;
    }

    return true;
}

// 정렬
function sortTable(grade) {
    gradeData[grade].sort((a, b) => {
        const course = { "전공": 1, "교양": 2 };
        const courseCompare = course[a.이수] - course[b.이수];
        if (courseCompare !== 0) return courseCompare;

        // 필수 우선순위: 필수 > 선택
        const essOrCho = { "필수": 1, "선택": 2 };
        const essCompare = essOrCho[a.필수] - essOrCho[b.필수];
        if (essCompare !== 0) return essCompare;

        return a.과목명.localeCompare(b.과목명);
    });
}