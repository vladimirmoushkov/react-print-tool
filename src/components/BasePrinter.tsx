import React from "react";

export interface IBasePrinterProps {
  unMount: () => void;
}

export abstract class BasePrinter<T extends IBasePrinterProps> extends React.Component<T> {

  constructor(props: T) {
    super(props);
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = 
    `@media screen{
        .print-wrapper{
            display:none
        }
    }
    @media print{
        body *{
            visibility:hidden
        }
        .print-wrapper,.print-wrapper *{
            visibility:visible!important
        }
        .print-wrapper{
            position:absolute;
            left:0;
            top:0;
            width:100%;
        }
    }`;
    this._styleTag = document.head.appendChild(style);
  }

  private _styleTag: HTMLStyleElement;
  protected abstract _renderContent(): JSX.Element;

  public render(): JSX.Element {
    return <div className="print-section">{this._renderContent()}</div>;
  }

  public componentDidCatch() {
    this._styleTag.remove();
    this.props.unMount();
  }

  public componentDidMount(): void {
    /** 100 to wait for css to be applied  */
    setTimeout(() => {
      window.print();
      this._styleTag.remove();
      this.props.unMount();
    }, 100);
  }
}
