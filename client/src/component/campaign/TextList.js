import { useNavigate } from 'react-router-dom';

const TextList = ({campaignList}) => {
  const navigate = useNavigate();
  return (
    <button className="cont" onClick={()=>{navigate(`/campaign/detail/${campaignList.id}`)}}>
      <p className="txt">{
        campaignList.title.length > 20 
          ? campaignList.title.slice(0, 20) + "..."
          : campaignList.title
      }</p>
      <div className="txt-info">
        <p className="username">{campaignList.username}</p>
        <p className="date">{campaignList.date.slice(0, 10).replace('T', ' ')}</p>
      </div>
      
    </button>
  )
}

export default TextList;