import{u as h,r as a,j as e,ar as C}from"./index-B2YqtOc4.js";function N(){const{login:o,signup:r}=h(),[t,i]=a.useState(!1),[l,b]=a.useState(""),[g,f]=a.useState(""),[c,v]=a.useState(""),[d,w]=a.useState(""),[u,j]=a.useState(""),[m,y]=a.useState(""),[p,x]=a.useState("signin"),S=async s=>{s.preventDefault(),i(!0);try{console.log("Logging in with:",{email:l}),await o(l,g),console.log("Login successful")}catch(n){console.error("Login error:",n),alert(n instanceof Error?n.message:"Login failed")}finally{i(!1)}},L=async s=>{if(s.preventDefault(),u!==m){alert("Passwords do not match");return}i(!0);try{console.log("Signing up with:",{email:d,name:c}),await r(d,u,c),console.log("Signup successful"),alert("Account created successfully!")}catch(n){console.error("Signup error:",n),alert(n instanceof Error?n.message:"Signup failed")}finally{i(!1)}};return e.jsxs("div",{className:"auth-container",children:[e.jsxs("div",{className:"tabs",children:[e.jsx("div",{className:`tab ${p==="signin"?"active":""}`,onClick:()=>x("signin"),children:"Sign In"}),e.jsx("div",{className:`tab ${p==="signup"?"active":""}`,onClick:()=>x("signup"),children:"Sign Up"})]}),p==="signin"?e.jsxs("form",{onSubmit:S,children:[e.jsx("input",{type:"email",placeholder:"Email",value:l,onChange:s=>b(s.target.value),disabled:t}),e.jsx("input",{type:"password",placeholder:"Password",value:g,onChange:s=>f(s.target.value),disabled:t}),e.jsx("button",{type:"submit",disabled:t,children:t?"Loading...":"Login"})]}):e.jsxs("form",{onSubmit:L,children:[e.jsx("input",{type:"text",placeholder:"Full Name",value:c,onChange:s=>v(s.target.value),disabled:t}),e.jsx("input",{type:"email",placeholder:"Email",value:d,onChange:s=>w(s.target.value),disabled:t}),e.jsx("input",{type:"password",placeholder:"Password",value:u,onChange:s=>j(s.target.value),disabled:t}),e.jsx("input",{type:"password",placeholder:"Confirm Password",value:m,onChange:s=>y(s.target.value),disabled:t}),e.jsx("button",{type:"submit",disabled:t,children:t?"Loading...":"Register"})]}),e.jsx("style",{jsx:!0,children:`
        .auth-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
        }

        .tab {
          flex: 1;
          text-align: center;
          padding: 10px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          border-bottom: 2px solid #6b46c1;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.2);
          color: white;
        }

        button {
          padding: 10px;
          background-color: #6b46c1;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `})]})}function E(){const{user:o,isLoading:r}=h();return!r&&o?e.jsx(C,{to:"/"}):e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-purple-900",children:e.jsxs("div",{className:"bg-purple-800 p-8 rounded-lg shadow-lg w-full max-w-md",children:[e.jsx("h1",{className:"text-3xl font-bold text-center text-white mb-6",children:"Mystic Arcana"}),e.jsx("p",{className:"text-center text-purple-200 mb-8",children:"Discover your cosmic destiny"}),e.jsx(N,{})]})})}export{E as default};
