document.addEventListener('DOMContentLoaded', () => {
    // UI 요소
    const authSection = document.getElementById('auth-section');
    const employeeSection = document.getElementById('employee-section');
    const loginForm = document.getElementById('login-form');
    const toggleLink = document.getElementById('toggle-auth-mode');
    
    // 인증 폼 내부 요소
    const authTitle = document.getElementById('auth-title');
    const signupFields = document.getElementById('signup-fields');
    const mainAuthBtn = document.getElementById('main-auth-btn');
    const toggleText = document.getElementById('toggle-text');
    const authMessage = document.getElementById('auth-message');
    const loggedInUserSpan = document.getElementById('logged-in-user');

    // 직원 관리 요소
    const employeeListDiv = document.getElementById('employee-list');
    const employeeForm = document.getElementById('employee-form');
    const logoutButton = document.getElementById('logout-button');
    const refreshEmployeesButton = document.getElementById('refresh-employees');
    const employeeMessage = document.getElementById('employee-message');
    const cancelEditButton = document.getElementById('cancel-edit');
    const loadingIndicator = document.getElementById('loading-indicator');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const badgesCheckboxesDiv = document.getElementById('badges-checkboxes');

    let jwtToken = localStorage.getItem('jwtToken');
    let isSignupMode = false;
    const API_BASE_URL = ''; 
    const DEFAULT_PHOTO_PLACEHOLDER = '/no_photo.png';

    // --- [복구] 토글 기능 ---
    toggleLink.addEventListener('click', () => {
        isSignupMode = !isSignupMode;
        if (isSignupMode) {
            authTitle.innerText = "Register";
            signupFields.style.display = "block";
            mainAuthBtn.innerText = "Create Account";
            toggleText.innerText = "Already have an account?";
            toggleLink.innerText = "Login here";
        } else {
            authTitle.innerText = "Login";
            signupFields.style.display = "none";
            mainAuthBtn.innerText = "Login";
            toggleText.innerText = "Don't have an account?";
            toggleLink.innerText = "Register here";
        }
    });

    // --- UI 전환 ---
    function setAuthUI(loggedIn) {
        if (loggedIn && jwtToken) {
            try {
                const payload = JSON.parse(atob(jwtToken.split('.')[1]));
                loggedInUserSpan.textContent = `${payload.user} (ID: ${payload.id})`; 
                authSection.style.display = 'none';
                employeeSection.style.display = 'block';
                fetchEmployees();
            } catch (e) {
                logout();
            }
        } else {
            authSection.style.display = 'block';
            employeeSection.style.display = 'none';
            resetEmployeeForm();
        }
    }
    
// --- 로그인/회원가입 요청 ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();

        // 1. 공통 필드 (아이디, 비번) 가져오기
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        let url = isSignupMode ? `${API_BASE_URL}/api/auth/register` : `${API_BASE_URL}/api/auth/login`;
        
        // 2. 서버가 요구하는 정확한 필드명으로 객체 생성
        // 핵심: register든 login이든 'username' 필드는 필수임!
        let bodyData = { 
            username: username, 
            password: password 
        };

        // 3. 회원가입 모드일 때만 추가 필드 포함
        if (isSignupMode) {
            bodyData.full_name = document.getElementById('full_name_reg').value;
            bodyData.email = document.getElementById('email_reg').value;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData) // 이제 여기 username이 무조건 포함됨!
            });

            const data = await response.json();

            if (response.ok) {
                if (isSignupMode) {
                    // Registration successful! 메시지 출력
                    showMessage(authMessage, '회원가입 성공! 로그인을 진행해주세요.');
                    // 폼 초기화 및 로그인 모드로 전환
                    isSignupMode = false;
                    toggleLink.click(); 
                } else {
                    // 로그인 성공 시
                    jwtToken = data.token;
                    localStorage.setItem('jwtToken', jwtToken);
                    setAuthUI(true);
                }
            } else {
                // 서버에서 보낸 에러 메시지 표시 (이미 가입된 아이디 등)
                // data.message가 없을 수도 있으니 data.detail 등도 체크
                const errorMsg = data.message || data.detail || '인증 실패';
                showMessage(authMessage, typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg), true);
            }
        } catch (error) {
            // CORS 에러나 네트워크 에러 발생 시
            showMessage(authMessage, "서버 연결 실패: " + error.message, true);
            console.error("Connection Error:", error);
        } finally { 
            hideLoading(); 
        }
    });

    // --- 직원 목록 출력 (기존 클래스명 적용) ---
    async function fetchEmployees() {
        showLoading();
        try {
            const response = await fetch(`${API_BASE_URL}/api/employee/employees`, { headers: getAuthHeaders() });
            if (response.status === 401) return logout();
            const employees = await response.json();
            employeeListDiv.innerHTML = '';
            employees.forEach(emp => {
                const empDiv = document.createElement('div');
                empDiv.className = 'employee-item';
                const displayPhoto = emp.photo_url || DEFAULT_PHOTO_PLACEHOLDER;
                empDiv.innerHTML = `
                    <img src="${displayPhoto}" alt="${emp.full_name}" width="120" height="160">
                    <div>
                        <h4>${emp.full_name} (${emp.job_title})</h4>
                        <p>Location: ${emp.location}</p>
                        <p>Badges: ${emp.badges || 'N/A'}</p>
                        <button class="edit-employee" data-id="${emp.id}">Edit</button>
                        <button class="delete-employee" data-id="${emp.id}">Delete</button>
                    </div>
                `;
                employeeListDiv.appendChild(empDiv);
            });
            addEmployeeEventListeners();
        } catch (error) { console.error(error); }
        finally { hideLoading(); }
    }

    function addEmployeeEventListeners() {
        // 사용자님의 원래 클래스명(.edit-employee)으로 이벤트 바인딩
        document.querySelectorAll('.edit-employee').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const response = await fetch(`${API_BASE_URL}/api/employee/employee/${id}`, { headers: getAuthHeaders() });
                const emp = await response.json();
                if (response.ok) {
                    document.getElementById('employee-id').value = emp.id;
                    document.getElementById('full_name').value = emp.full_name;
                    document.getElementById('location').value = emp.location;
                    document.getElementById('job_title').value = emp.job_title;
                    photoPreview.src = emp.photo_url || DEFAULT_PHOTO_PLACEHOLDER;
                    cancelEditButton.style.display = 'inline-block';
                }
            });
        });
        document.querySelectorAll('.delete-employee').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (!confirm('Delete?')) return;
                await fetch(`${API_BASE_URL}/api/employee/employee/${e.target.dataset.id}`, { method: 'DELETE', headers: getAuthHeaders() });
                fetchEmployees();
            });
        });
    }

    // --- 기타 함수 (기본 유지) ---
  async function logout() {
    const token = localStorage.getItem('jwtToken');
    let url = `${API_BASE_URL}/api/auth/logout`;
    if (token) {
        try {
            // 1. 백엔드(Auth Server)에 로그아웃 알림
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Logout API call failed:", error);
        }
    }

    // 2. 클라이언트 상태 정리 (API 호출 성공 여부와 상관없이 수행)
    jwtToken = null;
    localStorage.removeItem('jwtToken');
    setAuthUI(false);
    alert("로그아웃 되었습니다.");
    location.reload(); // 페이지 새로고침으로 상태 초기화
}

    function showMessage(el, msg, err) { el.textContent = msg; el.style.color = err ? 'red' : 'green'; }
    function showLoading() { loadingIndicator.style.display = 'block'; }
    function hideLoading() { loadingIndicator.style.display = 'none'; }
    function getAuthHeaders() { return jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {}; }
    function resetEmployeeForm() { 
        employeeForm.reset(); 
        document.getElementById('employee-id').value = ''; 
        photoPreview.src = DEFAULT_PHOTO_PLACEHOLDER;
        cancelEditButton.style.display = 'none';
    }

    // 직원 추가/수정 제출
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = document.getElementById('employee-id').value;
        if (id) formData.append('employee_id', id);
        formData.append('full_name', document.getElementById('full_name').value);
        formData.append('location', document.getElementById('location').value);
        formData.append('job_title', document.getElementById('job_title').value);
        const badges = Array.from(badgesCheckboxesDiv.querySelectorAll('input:checked')).map(cb => cb.value).join(',');
        formData.append('badges', badges);
        if (photoInput.files[0]) formData.append('photo', photoInput.files[0]);

        const response = await fetch(`${API_BASE_URL}/api/employee/employee`, {
            method: 'POST', headers: getAuthHeaders(), body: formData
        });
        if (response.ok) { resetEmployeeForm(); fetchEmployees(); }
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => { photoPreview.src = ev.target.result; };
            reader.readAsDataURL(file);
        }
    });

    logoutButton.addEventListener('click', logout);
    refreshEmployeesButton.addEventListener('click', fetchEmployees);
    cancelEditButton.addEventListener('click', resetEmployeeForm);

    if (jwtToken) setAuthUI(true);
});
