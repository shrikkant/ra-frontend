import PageContainer from "./PageContainer";

export function PageTitle({ title }) {
  return (<section className="s-header-title">
    <PageContainer>
      <h1>{title}</h1>
      <ul className="breadcrambs">
        <li><a href="/">Home</a></li>
        <li>{title}  </li>
      </ul>
    </PageContainer>
  </section>);
}
