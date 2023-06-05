import styles from './modal.module.css';

export function Modal(props: any) {
  const { isOpen } = props;
  const classList = isOpen ? [styles['modal'], styles['modal--open']] : [styles['modal']];
  return (
    <section className={classList.join(' ')}>
      <section className={styles["modal__content"]}>
        { props.children }
      </section>
    </section>
  )
}