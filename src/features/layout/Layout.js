import React from 'react';
import ActionMenu from '../components/ActionMenu';
import UserMenu from '../components/UserMenu';
import './Layout.less';

export class GlobalLayout extends React.Component {
  componentDidMount() {
    const { pathname } = this.props.history.location;
    if (pathname === '' || pathname === '/') {
      this.props.history.push('/drag');
    }
  }

  render() {
    const active = this.props.history.location.pathname;
    return (
      <div className="container">
        <div className="main-container">
          <div className="header">
            <div className="btn-list">
              <div className="logo">Drag</div>
              <div className="operation">
                <ActionMenu active={active} />
              </div>
              <div className="user-center">
                <div className="btn">
                  <UserMenu></UserMenu>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: 'calc(100% - 64px)' }}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default GlobalLayout;
