import React, { Component } from 'react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import './styles.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/create-project">Create Project</Link>
            <Link to="/projects">Projects</Link>
          </nav>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/create-project" component={CreateProject} />
            <Route path="/projects" component={ProjectList} />
            <Route path="/" exact component={Login} />
          </Switch>
        </div>
      </Router>
    );
  }
}

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    try {
      await axios.post('/api/register', { email, password });
      this.props.history.push('/login');
    } catch (err) {
      this.setState({ error: err.response.data.message });
    }
  };

  render() {
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
          <button type="submit">Register</button>
        </form>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    try {
      const { data } = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', data.token);
      this.props.history.push('/projects');
    } catch (err) {
      this.setState({ error: err.response.data.message });
    }
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      error: null
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, description } = this.state;
    try {
      const { data } = await axios.post('/api/projects', { name, description }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      this.props.history.push('/projects');
    } catch (err) {
      this.setState({ error: err.response.data.message });
    }
  };

  render() {
    return (
      <div>
        <h2>Create Project</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Project Name" />
          <textarea name="description" value={this.state.description} onChange={this.handleChange} placeholder="Project Description"></textarea>
          <button type="submit">Create Project</button>
        </form>
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      this.setState({ projects: data, loading: false });
    } catch (err) {
      this.setState({ error: err.response.data.message, loading: false });
    }
  };

  render() {
    const { projects, loading, error } = this.state;

    return (
      <div>
        <h2>Projects</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul>
          {projects.map(project => (
            <li key={project._id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(App);
