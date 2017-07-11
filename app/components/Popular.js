var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api')


function RepoGrid(props) {
  return(
    <div>
      <ul className="popular-list" >
        {props.repos.map(function (repo, index) {
          return (
            <li key="repo.name" className="popular-item" >
              <div className="popular-rank" >#{index + 1}</div>
              <ul className="popular-item-space" >
                <li>
                  <img
                    className="avatar"
                    src={repo.owner.avatar_url}
                    alt={'Avatar for' + repo.owner.login} />
                </li>
                <li><a href={repo.html_url}>{repo.name}</a></li>
                <li>@{repo.owner.login}</li>
                <li>{repo.stargazers_count} stars</li>
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

RepoGrid.PropTypes = {
  props: PropTypes.string.isRequired
}

function SelectLanguage (props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {languages.map(function (lang) {
        return (
          <li
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={props.onSelectLanguage.bind(null, lang)}
            key={lang}>
              {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelectLanguage: PropTypes.func.isRequired,
};

// -------- Popular Component -------- //
class Popular extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };

    this.selectLanguage = this.selectLanguage.bind(this);
  }

  componentDidMount() {
    this.selectLanguage(this.state.selectedLanguage)
  }

  selectLanguage(lang) {
    this.setState(function () {
      return {
        selectedLanguage: lang,
        repos: null
      }
    });
    api.fetchPopularRepos(lang)
       .then(function (repos) {
         this.setState(function () {
           return {
             repos: repos
           }
         });
       }.bind(this));
  }
  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelectLanguage={this.selectLanguage} />
        {!this.state.repos ? <div>Loading...</div> : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

module.exports = Popular;
